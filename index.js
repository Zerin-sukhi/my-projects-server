const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const fileUpload = require("express-fileupload");

// const path = require('path');
// const nodemailer = require('nodemailer');
// const buildPath = path.join(__dirname, '..', 'build');
// app.use(express.static(buildPath));
//gubStudent
//g2jIaTIMebPhbbmA
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.os8em.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    //console.log('connected successfully');
    const database = client.db("students_association");
    const servicesCollection = database.collection("services");
    const meetingCollection = database.collection("meetings");
    const usersCollection = database.collection("users");
    const donatorCollection = database.collection("donators");
    const booksCollection = database.collection("books");
    const computerCollection = database.collection("computer");
    const reviewCollection = database.collection("review");
    const careerCollection = database.collection("career");

    app.get("/meetings", async (req, res) => {
      const email = req.query.email;
      const date = new Date(req.query.date).toLocaleDateString();
      //console.log(date);
      const query = { email: email, date: date };
      const cursor = meetingCollection.find(query);
      const meetings = await cursor.toArray();
      res.json(meetings);
    });

    app.get("/allMember", async (req, res) => {
      const result = await meetingCollection.find({}).toArray();
      res.send(result);
    });

    app.post("/meetings", async (req, res) => {
      const meeting = req.body;
      const result = await meetingCollection.insertOne(meeting);
      //console.log(result);
      res.json(result);
    });

    app.post("/addBooks", async (req, res) => {
      console.log(req.body);
      const result = await booksCollection.insertOne(req.body);
      console.log(result);
    });

    app.get("/allBooks", async (req, res) => {
      const result = await booksCollection.find({}).toArray();
      res.send(result);
    });

    app.post("/addDonators", async (req, res) => {
      console.log(req.body);
      const result = await donatorCollection.insertOne(req.body);
      console.log(result);
    });
    app.get("/allDonators", async (req, res) => {
      const result = await donatorCollection.find({}).toArray();
      res.send(result);
    });

    app.post("/addMembership", async (req, res) => {
      console.log(req.body);
      const result = await computerCollection.insertOne(req.body);
      console.log(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      //console.log('put',user);
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      console.log("put", user);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // add rating/review
    app.post("/addReview", async (req, res) => {
      const result = await reviewCollection.insertOne(req.body);
      res.send(result);
    });
    // get all review
    app.get("/allReview", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
      console.log(result);
    });
    // add career
    app.post("/addCareer", async (req, res) => {
      const result = await careerCollection.insertOne(req.body);
      res.send(result);
    });

    // get all career
    app.get("/allCareer", async (req, res) => {
      const result = await careerCollection.find({}).toArray();
      res.send(result);
      console.log(result);
    });
    // add service
    app.post("/addServices", async (req, res) => {
      const result = await servicesCollection.insertOne(req.body);
      res.send(result);
    });

    // get all service
    app.get("/allServices", async (req, res) => {
      const result = await servicesCollection.find({}).toArray();
      res.send(result);
      console.log(result);
    });

    // get single service
    app.get("/singleService/:id", async (req, res) => {
      const result = await servicesCollection
        .find({ _id: ObjectId(req.params.id) })
        .toArray();
      res.send(result[0]);
    });
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello gub students!");
});

app.listen(port, () => {
  console.log(`connect to port: ${port}`);
});
