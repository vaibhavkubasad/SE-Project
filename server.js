import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import https from "https";


function makeFlexibleRegexString(str) {
    if (!str) return "^$";
    const clean = String(str).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '');
    return '^' + clean.split('').join('\\s*') + '$';
}

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing in .env");
    process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");

const productDb = mongoose.connection.useDb("PRODUCT");
const userDb = mongoose.connection.useDb("USERLOGIN");

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(cors());

app.get("/api/oils", async (_req, res) => {
    try {
        const oils = await productDb.collection("OIL").find().toArray();
        res.json(oils);
    } catch (err) {
        console.error("oils error:", err);
        res.status(500).json({ msg: "Failed to load oils" });
    }
});

app.get("/api/masalas", async (_req, res) => {
    try {
        const masalas = await productDb.collection("MASALA").find().toArray();
        res.json(masalas);
    } catch (err) {
        console.error("masalas error:", err);
        res.status(500).json({ msg: "Failed to load masalas" });
    }
});






const COLLECTION_BY_ROLE = {
    Wholesaler: "WHOLESALERS",
    Manager: "MANAGER",
    Admin: "ADMIN",
    Driver: "DRIVERS"
};

app.post("/api/login", async (req, res) => {
    try {
        const { role, name, password } = req.body || {};

        if (!role || !name || !password) {
            return res.status(400).json({ msg: "Role, name and password are required" });
        }

        const collectionName = COLLECTION_BY_ROLE[role];
        if (!collectionName) {
            return res.status(400).json({ msg: `Unknown role: ${role}` });
        }

        const trimmedName = String(name).trim();
        const trimmedPassword = String(password).trim();

        const user = await userDb
            .collection(collectionName)
            .findOne({ name: { $regex: `^${trimmedName}$`, $options: "i" } });

        if (!user) {
            return res.status(401).json({ msg: "Invalid username or password" });
        }

        const stored = String(user.password || "");
        const isHashed = stored.startsWith("$2");
        const ok = isHashed
            ? bcrypt.compareSync(trimmedPassword, stored)
            : stored === trimmedPassword;

        if (!ok) {
            return res.status(401).json({ msg: "Invalid username or password" });
        }

        const { password: _omit, ...safeUser } = user;
        res.json({ msg: "Login successful", user: safeUser });
    } catch (err) {
        console.error("login error:", err);
        res.status(500).json({ msg: "Login failed" });
    }
});

// ==========================================
// NEW: DRIVER APIs
// ==========================================
app.get("/api/drivers", async (req, res) => {
    try {
        const defaultDrivers = [
            { name: "Ramesh Kumar", phone: "+918762983290" },
            { name: "Suresh Singh", phone: "+917349197149" },
            { name: "Mahesh Patil", phone: "+918431309384" }
        ];

        for (const drv of defaultDrivers) {
            await userDb.collection("DRIVERS").updateOne(
                { name: { $regex: `^${drv.name}$`, $options: "i" } },
                { $set: { name: drv.name, phone: drv.phone } },
                { upsert: true }
            );
        }

        const drivers = await userDb.collection("DRIVERS").find().toArray();
        res.json(drivers);
    } catch (err) {
        console.error("drivers get error:", err);
        res.status(500).json({ msg: "Failed to load drivers" });
    }
});

app.post("/api/drivers", async (req, res) => {
    try {
        const { name } = req.body || {};
        if (!name) return res.status(400).json({ msg: "Driver name is required" });
        await userDb.collection("DRIVERS").insertOne({ name });
        res.json({ msg: "Driver added successfully" });
    } catch (err) {
        console.error("drivers post error:", err);
        res.status(500).json({ msg: "Failed to add driver" });
    }
});

// ==========================================
// NEW: ORDER APIs
// ==========================================
app.post("/api/orders", async (req, res) => {
    try {
        const { wholesalerName, items, totalAmount } = req.body || {};
        if (!wholesalerName || !items || !totalAmount) {
            return res.status(400).json({ msg: "Wholesaler name, items and totalAmount are required" });
        }

        const newOrder = {
            wholesalerName,
            items,
            totalAmount,
            status: "Pending",
            driverName: null,
            createdAt: new Date()
        };

        await userDb.collection("ORDERS").insertOne(newOrder);

        // Decrease stock if stock field exists in inventory, fallback to 100 if undefined
        for (const item of items) {
            const qty = Number(item.qty) || 1;
            if (item.oilName) {
                const formattedType = item.oilName.replace(/\s*[Oo]il\s*$/, "").trim();
                const query = {
                    companyName: { $regex: makeFlexibleRegexString(item.brand), $options: "i" },
                    oilType: { $regex: makeFlexibleRegexString(formattedType), $options: "i" },
                    quantity: { $regex: makeFlexibleRegexString(item.pack), $options: "i" }
                };
                const doc = await productDb.collection("OIL").findOne(query);
                if (doc) {
                    const currentStock = doc.stock !== undefined ? doc.stock : 100;
                    await productDb.collection("OIL").updateOne(
                        { _id: doc._id },
                        { $set: { stock: currentStock - qty } }
                    );
                }
            } else if (item.name) {
                // Decrement masala stock
                const query = {
                    name: { $regex: makeFlexibleRegexString(item.name), $options: "i" },
                    weight: { $regex: makeFlexibleRegexString(item.pack), $options: "i" }
                };
                const doc = await productDb.collection("MASALA").findOne(query);
                if (doc) {
                    const currentStock = doc.stock !== undefined ? doc.stock : 100;
                    await productDb.collection("MASALA").updateOne(
                        { _id: doc._id },
                        { $set: { stock: currentStock - qty } }
                    );
                }
            }
        }

        res.json({ msg: "Order placed successfully", order: newOrder });
    } catch (err) {
        console.error("place order error:", err);
        res.status(500).json({ msg: "Failed to place order" });
    }
});

app.get("/api/orders", async (req, res) => {
    try {
        const { wholesalerName } = req.query || {};
        const query = wholesalerName ? { wholesalerName } : {};
        const orders = await userDb.collection("ORDERS").find(query).sort({ createdAt: -1 }).toArray();
        res.json(orders);
    } catch (err) {
        console.error("get orders error:", err);
        res.status(500).json({ msg: "Failed to load orders" });
    }
});

// ==========================================
// Twilio SMS Helper Function
// ==========================================
async function sendSMS(to, body) {
    if (!to) return { success: false, reason: "No recipients" };

    // Support comma-separated list of numbers
    const recipients = String(to).split(",").map(n => n.trim()).filter(Boolean);
    if (recipients.length > 1) {
        console.log(`[Twilio] Multiple recipients detected: ${recipients.join(", ")}`);
        const promises = recipients.map(recipient => sendSMS(recipient, body));
        const results = await Promise.all(promises);
        return { success: results.every(r => r.success), results };
    }

    const singleTo = recipients[0];

    return new Promise((resolve) => {
        const sid = process.env.TWILIO_ACCOUNT_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;
        const from = process.env.TWILIO_FROM_NUMBER;

        if (!sid || !token || !from) {
            console.warn("[Twilio] Credentials or from number are missing in .env. SMS skipped.");
            return resolve({ success: false, reason: "Credentials missing" });
        }

        const authHeader = "Basic " + Buffer.from(`${sid}:${token}`).toString("base64");
        const postData = new URLSearchParams({
            To: singleTo,
            From: from,
            Body: body
        }).toString();

        const options = {
            hostname: "api.twilio.com",
            port: 443,
            path: `/2010-04-01/Accounts/${sid}/Messages.json`,
            method: "POST",
            headers: {
                "Authorization": authHeader,
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(postData)
            }
        };

        console.log(`[Twilio] Sending SMS to ${singleTo}...`);
        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => { data += chunk; });
            res.on("end", () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const parsed = JSON.parse(data);
                    console.log(`[Twilio] SMS sent successfully. Message SID: ${parsed.sid}`);
                    resolve({ success: true, sid: parsed.sid });
                } else {
                    console.error("[Twilio] Error response from Twilio:", data);
                    resolve({ success: false, error: data });
                }
            });
        });

        req.on("error", (err) => {
            console.error("[Twilio] Exception while sending SMS:", err);
            resolve({ success: false, error: err.message });
        });

        req.write(postData);
        req.end();
    });
}


app.put("/api/orders/:id/assign", async (req, res) => {
    try {
        const { id } = req.params;
        const { driverName } = req.body || {};
        if (!driverName) {
            return res.status(400).json({ msg: "Driver name is required" });
        }
        await userDb.collection("ORDERS").updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: { driverName, status: "Assigned" } }
        );

        // Fetch driver details to get the phone number using regex
        const driver = await userDb.collection("DRIVERS").findOne({ name: { $regex: makeFlexibleRegexString(driverName), $options: "i" } });
        
        if (driver) {
            await userDb.collection("ORDERS").updateOne(
                { _id: new mongoose.Types.ObjectId(id) },
                { $set: { driverName: driver.name } }
            );
        }
        
        // Fetch order details for the SMS body
        const order = await userDb.collection("ORDERS").findOne({ _id: new mongoose.Types.ObjectId(id) });

        if (driver && driver.phone && order) {
            const formattedTotal = "₹" + Number(order.totalAmount).toLocaleString("en-IN");
            
            // Fetch wholesaler details
            const wholesaler = await userDb.collection("WHOLESALERS").findOne({ name: order.wholesalerName });
            const addressInfo = wholesaler && wholesaler.address ? `, Address: ${wholesaler.address}` : "";
            
            // 1. Send SMS to Driver
            const smsMessage = `[Akalwadi Associates] Hello ${driver.name}, you have been assigned to deliver order for "${order.wholesalerName}". Amount: ${formattedTotal}${addressInfo}.`;
            sendSMS(driver.phone, smsMessage).catch(err => {
                console.error("Async driver SMS sending failed:", err);
            });

            // 2. Send SMS to Wholesaler (Customer) if they have a phone number registered
            if (wholesaler && wholesaler.phone) {
                const wholesalerMessage = `[Akalwadi Associates] Hello ${wholesaler.name}, driver ${driver.name} (Phone: ${driver.phone}) has been assigned to deliver your order of ${formattedTotal}.`;
                sendSMS(wholesaler.phone, wholesalerMessage).catch(err => {
                    console.error("Async wholesaler SMS sending failed:", err);
                });
            }
        } else {
            console.log(`SMS not sent. Driver found: ${!!driver}, Has phone: ${driver ? !!driver.phone : false}, Order found: ${!!order}`);
        }

        res.json({ msg: "Driver assigned successfully" });
    } catch (err) {
        console.error("assign driver error:", err);
        res.status(500).json({ msg: "Failed to assign driver" });
    }
});

app.put("/api/orders/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body || {};
        if (!status) {
            return res.status(400).json({ msg: "Status is required" });
        }
        await userDb.collection("ORDERS").updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: { status } }
        );
        res.json({ msg: "Status updated successfully" });
    } catch (err) {
        console.error("update status error:", err);
        res.status(500).json({ msg: "Failed to update status" });
    }
});

// ==========================================
// NEW: INVENTORY APIs
// ==========================================
app.get("/api/inventory", async (req, res) => {
    try {
        const oils = await productDb.collection("OIL").find().toArray();
        const masalas = await productDb.collection("MASALA").find().toArray();

        const oilItems = oils.map(o => ({
            _id: o._id,
            type: "Oil",
            name: `${o.companyName} ${o.oilType} Oil`,
            companyName: o.companyName,
            oilType: o.oilType,
            pack: o.quantity,
            price: o.price,
            stock: o.stock !== undefined ? o.stock : 100,
            image: o.image || o.thumbnail || ""
        }));

        const masalaItems = masalas.map(m => ({
            _id: m._id,
            type: "Masala",
            name: m.name,
            pack: m.weight,
            price: m.price,
            stock: m.stock !== undefined ? m.stock : 100,
            image: m.image || m.thumbnail || ""
        }));

        res.json([...oilItems, ...masalaItems]);
    } catch (err) {
        console.error("get inventory error:", err);
        res.status(500).json({ msg: "Failed to load inventory" });
    }
});

app.post("/api/inventory/:type", async (req, res) => {
    try {
        const { type } = req.params;
        const { name, companyName, oilType, quantity, weight, price, stock, image } = req.body || {};

        if (price === undefined || price === "") {
            return res.status(400).json({ msg: "Price is required" });
        }

        const newStock = stock !== undefined && stock !== "" ? Number(stock) : 100;

        if (type.toLowerCase() === "oil") {
            if (!companyName || !oilType || !quantity) {
                return res.status(400).json({ msg: "Company name, oil type and quantity are required for Oil" });
            }
            const newItem = { companyName, oilType, quantity, price: Number(price), stock: newStock, image: image || "" };
            await productDb.collection("OIL").insertOne(newItem);
            return res.json({ msg: "Oil item added successfully", item: newItem });
        } else if (type.toLowerCase() === "masala") {
            if (!name || !weight) {
                return res.status(400).json({ msg: "Name and weight are required for Masala" });
            }
            const newItem = { name, weight, price: Number(price), stock: newStock, image: image || "" };
            await productDb.collection("MASALA").insertOne(newItem);
            return res.json({ msg: "Masala item added successfully", item: newItem });
        } else {
            res.status(400).json({ msg: `Unsupported item type: ${type}` });
        }
    } catch (err) {
        console.error("add inventory item error:", err);
        res.status(500).json({ msg: "Failed to add inventory item" });
    }
});

app.put("/api/inventory/:type/:id", async (req, res) => {
    try {
        const { type, id } = req.params;
        const { price, stock, companyName, oilType, quantity, name, weight, image } = req.body || {};

        const updates = {};
        if (price !== undefined && price !== "") updates.price = Number(price);
        if (stock !== undefined && stock !== "") updates.stock = Number(stock);
        if (companyName !== undefined) updates.companyName = companyName;
        if (oilType !== undefined) updates.oilType = oilType;
        if (quantity !== undefined) updates.quantity = quantity;
        if (name !== undefined) updates.name = name;
        if (weight !== undefined) updates.weight = weight;
        if (image !== undefined) updates.image = image;

        const targetCollection =
            type.toLowerCase() === "oil" ? "OIL" : "MASALA";

        await productDb.collection(targetCollection).updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: updates }
        );

        res.json({ msg: "Item updated successfully" });
    } catch (err) {
        console.error("update inventory item error:", err);
        res.status(500).json({ msg: "Failed to update inventory item" });
    }
});

app.delete("/api/inventory/:type/:id", async (req, res) => {
    try {
        const { type, id } = req.params;
        const targetCollection =
            type.toLowerCase() === "oil" ? "OIL" : "MASALA";

        await productDb.collection(targetCollection).deleteOne({ _id: new mongoose.Types.ObjectId(id) });
        res.json({ msg: "Item deleted successfully" });
    } catch (err) {
        console.error("delete inventory item error:", err);
        res.status(500).json({ msg: "Failed to delete inventory item" });
    }
});

// ==========================================
// ADMIN: ANALYTICS APIs
// ==========================================
app.get("/api/analytics/sales", async (req, res) => {
    try {
        const { period } = req.query; // 'week', 'month', 'all'
        let dateFilter = {};
        const now = new Date();

        if (period === "week") {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateFilter = { createdAt: { $gte: weekAgo } };
        } else if (period === "month") {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            dateFilter = { createdAt: { $gte: monthAgo } };
        }

        const orders = await userDb.collection("ORDERS").find(dateFilter).toArray();

        const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

        // Sales by category
        const categoryMap = { Oil: 0, Masala: 0 };
        const brandMap = {};

        for (const order of orders) {
            for (const item of (order.items || [])) {
                // Items store line total in 'total' field, fallback to packPrice*qty
                const lineTotal = Number(item.total) || (Number(item.packPrice || item.price || 0) * (Number(item.qty) || 1));

                if (item.oilName) {
                    categoryMap.Oil += lineTotal;
                    const brand = item.brand || "Unknown";
                    brandMap[brand] = (brandMap[brand] || 0) + lineTotal;
                } else if (item.name) {
                    // Try to determine if masala
                    categoryMap.Masala += lineTotal;
                    brandMap[item.name] = (brandMap[item.name] || 0) + lineTotal;
                }
            }
        }

        // Sort brands by revenue descending
        const salesByBrand = Object.entries(brandMap)
            .map(([name, revenue]) => ({ name, revenue }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        const salesByCategory = Object.entries(categoryMap)
            .map(([name, revenue]) => ({ name, revenue }));

        res.json({
            totalRevenue,
            totalOrders,
            avgOrderValue,
            salesByCategory,
            salesByBrand,
            deliveredOrders: orders.filter(o => o.status === "Delivered").length,
            pendingOrders: orders.filter(o => o.status === "Pending").length,
            assignedOrders: orders.filter(o => o.status === "Assigned").length
        });
    } catch (err) {
        console.error("analytics error:", err);
        res.status(500).json({ msg: "Failed to load analytics" });
    }
});

// ==========================================
// ADMIN: WHOLESALER (STORE) CRUD APIs
// ==========================================
app.get("/api/wholesalers", async (req, res) => {
    try {
        const wholesalers = await userDb.collection("WHOLESALERS").find().toArray();
        // Remove password from response
        const safe = wholesalers.map(({ password, ...rest }) => rest);
        res.json(safe);
    } catch (err) {
        console.error("get wholesalers error:", err);
        res.status(500).json({ msg: "Failed to load wholesalers" });
    }
});

app.post("/api/wholesalers", async (req, res) => {
    try {
        const { name, password, phone, address } = req.body || {};
        if (!name || !password) {
            return res.status(400).json({ msg: "Name and password are required" });
        }
        const newStore = {
            name,
            password,
            phone: phone || "",
            address: address || "",
            createdAt: new Date()
        };
        await userDb.collection("WHOLESALERS").insertOne(newStore);
        const { password: _omit, ...safeStore } = newStore;
        res.json({ msg: "Wholesaler added successfully", store: safeStore });
    } catch (err) {
        console.error("add wholesaler error:", err);
        res.status(500).json({ msg: "Failed to add wholesaler" });
    }
});

app.put("/api/wholesalers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, address, password } = req.body || {};
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (phone !== undefined) updates.phone = phone;
        if (address !== undefined) updates.address = address;
        if (password !== undefined && password !== "") updates.password = password;

        await userDb.collection("WHOLESALERS").updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: updates }
        );
        res.json({ msg: "Wholesaler updated successfully" });
    } catch (err) {
        console.error("update wholesaler error:", err);
        res.status(500).json({ msg: "Failed to update wholesaler" });
    }
});

app.delete("/api/wholesalers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await userDb.collection("WHOLESALERS").deleteOne({ _id: new mongoose.Types.ObjectId(id) });
        res.json({ msg: "Wholesaler deleted successfully" });
    } catch (err) {
        console.error("delete wholesaler error:", err);
        res.status(500).json({ msg: "Failed to delete wholesaler" });
    }
});

// ==========================================
// ADMIN: STAFF MANAGEMENT APIs
// ==========================================
app.get("/api/staff", async (req, res) => {
    try {
        const managers = await userDb.collection("MANAGER").find().toArray();
        const drivers = await userDb.collection("DRIVERS").find().toArray();

        const managerList = managers.map(({ password, ...rest }) => ({ ...rest, role: "Manager" }));
        const driverList = drivers.map(({ password, ...rest }) => ({ ...rest, role: "Driver" }));

        res.json([...managerList, ...driverList]);
    } catch (err) {
        console.error("get staff error:", err);
        res.status(500).json({ msg: "Failed to load staff" });
    }
});

app.post("/api/staff", async (req, res) => {
    try {
        const { name, password, role, phone } = req.body || {};
        if (!name || !password || !role) {
            return res.status(400).json({ msg: "Name, password and role are required" });
        }

        const collection = role === "Manager" ? "MANAGER" : "DRIVERS";
        const newStaff = { 
            name, 
            password, 
            createdAt: new Date(),
            ...(role === "Driver" ? { phone: phone || "" } : {})
        };
        await userDb.collection(collection).insertOne(newStaff);

        const { password: _omit, ...safeStaff } = newStaff;
        res.json({ msg: `${role} added successfully`, staff: { ...safeStaff, role } });
    } catch (err) {
        console.error("add staff error:", err);
        res.status(500).json({ msg: "Failed to add staff" });
    }
});

app.delete("/api/staff/:role/:id", async (req, res) => {
    try {
        const { role, id } = req.params;
        const collection = role === "Manager" ? "MANAGER" : "DRIVERS";
        await userDb.collection(collection).deleteOne({ _id: new mongoose.Types.ObjectId(id) });
        res.json({ msg: `${role} removed successfully` });
    } catch (err) {
        console.error("delete staff error:", err);
        res.status(500).json({ msg: "Failed to remove staff" });
    }
});

app.put("/api/staff/:role/:id", async (req, res) => {
    try {
        const { role, id } = req.params;
        const { name, phone, password } = req.body || {};

        const collection = role === "Manager" ? "MANAGER" : "DRIVERS";

        const oldStaff = await userDb.collection(collection).findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!oldStaff) {
            return res.status(404).json({ msg: "Staff member not found" });
        }

        const updates = {};
        if (name !== undefined) updates.name = name;
        if (password !== undefined && password !== "") updates.password = password;
        if (role === "Driver" && phone !== undefined) updates.phone = phone;

        await userDb.collection(collection).updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: updates }
        );

        // Update driverName on orders if name changes to preserve history
        if (role === "Driver" && name && oldStaff.name !== name) {
            await userDb.collection("ORDERS").updateMany(
                { driverName: oldStaff.name },
                { $set: { driverName: name } }
            );
        }

        res.json({ msg: `${role} updated successfully` });
    } catch (err) {
        console.error("update staff error:", err);
        res.status(500).json({ msg: "Failed to update staff" });
    }
});

app.get("/api/staff/performance", async (req, res) => {
    try {
        const orders = await userDb.collection("ORDERS").find().toArray();
        const drivers = await userDb.collection("DRIVERS").find().toArray();

        const driverPerf = drivers.map(drv => {
            const assigned = orders.filter(o => o.driverName === drv.name);
            const delivered = assigned.filter(o => o.status === "Delivered");
            return {
                name: drv.name,
                role: "Driver",
                totalAssigned: assigned.length,
                totalDelivered: delivered.length,
                pendingDeliveries: assigned.filter(o => o.status === "Assigned").length
            };
        });

        res.json(driverPerf);
    } catch (err) {
        console.error("staff performance error:", err);
        res.status(500).json({ msg: "Failed to load performance data" });
    }
});

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});

