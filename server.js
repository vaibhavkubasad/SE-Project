import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";

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
app.use(express.json());
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

app.get("/api/toiletries", async (_req, res) => {
    try {
        const toiletries = await productDb.collection("TOILETRIES").find().toArray();
        res.json(toiletries);
    } catch (err) {
        console.error("toiletries error:", err);
        res.status(500).json({ msg: "Failed to load toiletries" });
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
        const drivers = await userDb.collection("DRIVERS").find().toArray();
        if (drivers.length === 0) {
            // Seed default drivers if empty
            return res.json([
                { name: "Ramesh Kumar" },
                { name: "Suresh Singh" },
                { name: "Mahesh Patil" }
            ]);
        }
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

        // Decrease stock if stock field exists in inventory
        for (const item of items) {
            const qty = Number(item.qty) || 1;
            if (item.oilName) {
                const formattedType = item.oilName.replace(" Oil", "").trim();
                await productDb.collection("OIL").updateOne(
                    { companyName: item.brand, oilType: formattedType, quantity: item.pack },
                    { $inc: { stock: -qty } }
                );
            } else if (item.name) {
                await productDb.collection("MASALA").updateOne(
                    { name: item.name, weight: item.pack },
                    { $inc: { stock: -qty } }
                );
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
        const toiletries = await productDb.collection("TOILETRIES").find().toArray();

        const oilItems = oils.map(o => ({
            _id: o._id,
            type: "Oil",
            name: `${o.companyName} ${o.oilType} Oil`,
            companyName: o.companyName,
            oilType: o.oilType,
            pack: o.quantity,
            price: o.price,
            stock: o.stock !== undefined ? o.stock : 100
        }));

        const masalaItems = masalas.map(m => ({
            _id: m._id,
            type: "Masala",
            name: m.name,
            pack: m.weight,
            price: m.price,
            stock: m.stock !== undefined ? m.stock : 100
        }));

        const toiletryItems = toiletries.map(t => ({
            _id: t._id,
            type: "Toiletry",
            name: t.name,
            pack: t.quantity || "1 Pack",
            price: t.price,
            stock: t.stock !== undefined ? t.stock : 100
        }));

        res.json([...oilItems, ...masalaItems, ...toiletryItems]);
    } catch (err) {
        console.error("get inventory error:", err);
        res.status(500).json({ msg: "Failed to load inventory" });
    }
});

app.post("/api/inventory/:type", async (req, res) => {
    try {
        const { type } = req.params;
        const { name, companyName, oilType, quantity, weight, price, stock } = req.body || {};

        if (price === undefined || price === "") {
            return res.status(400).json({ msg: "Price is required" });
        }

        const newStock = stock !== undefined && stock !== "" ? Number(stock) : 100;

        if (type.toLowerCase() === "oil") {
            if (!companyName || !oilType || !quantity) {
                return res.status(400).json({ msg: "Company name, oil type and quantity are required for Oil" });
            }
            const newItem = { companyName, oilType, quantity, price: Number(price), stock: newStock };
            await productDb.collection("OIL").insertOne(newItem);
            return res.json({ msg: "Oil item added successfully", item: newItem });
        } else if (type.toLowerCase() === "masala") {
            if (!name || !weight) {
                return res.status(400).json({ msg: "Name and weight are required for Masala" });
            }
            const newItem = { name, weight, price: Number(price), stock: newStock };
            await productDb.collection("MASALA").insertOne(newItem);
            return res.json({ msg: "Masala item added successfully", item: newItem });
        } else if (type.toLowerCase() === "toiletry") {
            if (!name || !quantity) {
                return res.status(400).json({ msg: "Name and quantity are required for Toiletry" });
            }
            const newItem = { name, quantity, price: Number(price), stock: newStock };
            await productDb.collection("TOILETRIES").insertOne(newItem);
            return res.json({ msg: "Toiletry item added successfully", item: newItem });
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
        const { price, stock, companyName, oilType, quantity, name, weight } = req.body || {};

        const updates = {};
        if (price !== undefined && price !== "") updates.price = Number(price);
        if (stock !== undefined && stock !== "") updates.stock = Number(stock);
        if (companyName !== undefined) updates.companyName = companyName;
        if (oilType !== undefined) updates.oilType = oilType;
        if (quantity !== undefined) updates.quantity = quantity;
        if (name !== undefined) updates.name = name;
        if (weight !== undefined) updates.weight = weight;

        const targetCollection =
            type.toLowerCase() === "oil" ? "OIL" :
            type.toLowerCase() === "masala" ? "MASALA" : "TOILETRIES";

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
            type.toLowerCase() === "oil" ? "OIL" :
            type.toLowerCase() === "masala" ? "MASALA" : "TOILETRIES";

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
        const categoryMap = { Oil: 0, Masala: 0, Toiletry: 0 };
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
                    // Try to determine if masala or toiletry
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
        const { name, password, role } = req.body || {};
        if (!name || !password || !role) {
            return res.status(400).json({ msg: "Name, password and role are required" });
        }

        const collection = role === "Manager" ? "MANAGER" : "DRIVERS";
        const newStaff = { name, password, createdAt: new Date() };
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

