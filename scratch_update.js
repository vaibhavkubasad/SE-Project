import mongoose from 'mongoose';

const uri = 'mongodb+srv://Owner:seproject@cluster0.gys5tfh.mongodb.net/?appName=Cluster0';

async function run() {
    try {
        const conn = await mongoose.createConnection(uri).asPromise();
        const productDb = conn.useDb('PRODUCT');
        const oils = await productDb.collection('OIL').find({}).toArray();
        let updated = 0;
        
        for (let oil of oils) {
            if (oil.quantity && typeof oil.quantity === 'string' && oil.quantity === '15 Box') {
                await productDb.collection('OIL').updateOne(
                    { _id: oil._id }, 
                    { $set: { quantity: '15 L (Tin)' } }
                );
                updated++;
            }
        }
        
        console.log('Updated ' + updated + ' documents from 15 Box to 15 L (Tin)');
        await conn.close();
    } catch (e) {
        console.error(e);
    }
}

run();
