import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing in .env");
    process.exit(1);
}

async function fixNegativeStocks() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const productDb = mongoose.connection.useDb("PRODUCT");

    const oils = await productDb.collection("OIL").find().toArray();
    let updatedOils = 0;
    for (const oil of oils) {
        if (oil.stock !== undefined && oil.stock < 0) {
            console.log(`Fixing Oil: ${oil.companyName} ${oil.oilType} (Current: ${oil.stock})`);
            await productDb.collection("OIL").updateOne(
                { _id: oil._id },
                { $set: { stock: 100 + oil.stock } } // If it was -10, it becomes 90
            );
            updatedOils++;
        }
    }

    const masalas = await productDb.collection("MASALA").find().toArray();
    let updatedMasalas = 0;
    for (const masala of masalas) {
        if (masala.stock !== undefined && masala.stock < 0) {
            console.log(`Fixing Masala: ${masala.name} (Current: ${masala.stock})`);
            await productDb.collection("MASALA").updateOne(
                { _id: masala._id },
                { $set: { stock: 100 + masala.stock } } // If it was -10, it becomes 90
            );
            updatedMasalas++;
        }
    }

    console.log(`Fixed ${updatedOils} oils and ${updatedMasalas} masalas.`);
    process.exit(0);
}

fixNegativeStocks();
