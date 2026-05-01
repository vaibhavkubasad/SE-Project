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

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
