import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URL);
let destinationsCollection;
let bookingsCollection;

export async function connectToMongoDB() {
    await client.connect();
    console.log("successfully connected MongoDB!");

    // Database & Collection
    const db = client.db("wanderlustDB");
    destinationsCollection = db.collection("destinations");
    bookingsCollection = db.collection("bookings");
}
connectToMongoDB();

app.get('/', (req, res) => {
    res.send({ message: "server is running" });
});

app.post('/add-destinations', async (req, res) => {
    const newDestination = req.body;
    const result = await destinationsCollection.insertOne(newDestination);
    res.status(201).send({
        success: true,
        message: "Travel package added successfully!",
        insertedId: result.insertedId,
    });
});

app.get('/destination', async (req, res) => {
    const result = await destinationsCollection.find().toArray();
    res.send(result);
});

app.get("/destination/:id", async (req, res) => {
    const id = req.params.id;
    let result = null;

    if (ObjectId.isValid(id)) {
        result = await destinationsCollection.findOne({ _id: new ObjectId(id) });
    }

    if (!result) {
        result = await destinationsCollection.findOne({ _id: id });
    }

    res.send(result);
});

app.delete("/destination/:id", async (req, res) => {
    const id = req.params.id;
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) }:{ _id: id };
    const result = await destinationsCollection.deleteOne(query);
    res.send(result);
});

app.post("/destination", async (req, res) => {
    const bookingData = req.body;
    console.log(bookingData);
    const result = await destinationCollection.insertOne(destinationData);
    res.send(result);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});