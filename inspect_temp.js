import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "d:/sewebsite/SE final/SE-Project/.env" });

const mongoUri = process.env.MONGO_URI;

async function inspect() {
    await mongoose.connect(mongoUri);
    const productDb = mongoose.connection.useDb("PRODUCT");
    
    const toiletries = await productDb.collection("TOILETRIES").find().toArray();
    console.log("=== ALL TOILETRIES ===");
    console.log(JSON.stringify(toiletries.map(t => ({ name: t.name, quantity: t.quantity, price: t.price, stock: t.stock })), null, 2));
    
    await mongoose.disconnect();
}

inspect().catch(console.error);
