import express from 'express';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send({ message: "server is running" });
});

const client = new MongoClient(process.env.MONGODB_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("successfully connected MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

connectToMongoDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});