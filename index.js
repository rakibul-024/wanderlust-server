import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URL);
let destinationsCollection;

export async function connectToMongoDB() {
    await client.connect();
    console.log("successfully connected MongoDB!");

    // Database & Collection
    const db = client.db("wanderlustDB");
    destinationsCollection = db.collection("destinations");
}
connectToMongoDB();

app.get('/', (req, res) => {
    res.send({ message: "server is running" });
});

app.post('/add-destinations', async (req, res) => {
    const newDestination = req.body;
    console.log("New Destination Received:", newDestination);

    const result = await destinationsCollection.insertOne(newDestination);
    console.log(' backend result  :',result);
    res.send(result);
    res.status(201).send({
        success: true,
        message: "Travel package added successfully!",
        insertedId: result.insertedId,
    });
});

app.get('/destination', async (req,res) => {
    const result = await destinationsCollection.find().toArray();
    res.send(result);

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});