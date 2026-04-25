// server.js

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    dbName: "PRODUCT"
})
.then(() => console.log("MongoDB Connected to PRODUCT"))
.catch((err) => console.log("Mongo Error:", err));

// Schema
const productSchema = new mongoose.Schema({
    companyName: String,
    oilType: String,
    quantity: String,
    price: Number
}, {
    versionKey: false
});

// Collection = OIL
const Product = mongoose.connection.model("OIL", productSchema, "OIL");

// Add Product API
app.post("/addproduct", async (req, res) => {
    try {

        const companyName = req.body.companyName.trim();
        const oilType = req.body.oilType.trim();
        const quantity = req.body.quantity.trim();
        const price = Number(req.body.price);

        await Product.create({
            companyName: companyName,
            oilType: oilType,
            quantity: quantity,
            price: price
        });

        res.json({
            msg: "Oil Product Added Successfully"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            msg: "Failed to Add Product"
        });
    }
});

// Get All Products
app.get("/products", async (req, res) => {
    try {

        const data = await Product.find();

        res.json(data);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            msg: "Failed to Fetch Products"
        });
    }
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});