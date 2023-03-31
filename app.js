const express = require("express");
const bodyParser = require("body-parser");

const cors = require('cors');

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const dbName = "prabisha";
const collectionName = "users";
const app = express();
// app.use(cors());
app.use(cors({
  origin: '*'
}));
app.use(express.json()); // This will parse incoming request body as JSON



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// let db;

// MongoClient.connect(url, (err, client) => {
//   if (err) return console.log(err);
//   console.log(`Connected to MongoDB server: ${url}`);
//   db = client.db(dbName);
// });

// Connecting Data Base And Node JS

const url =
  "mongodb+srv://prabishait:lOT7B20MEd0aA5sC@cluster0.5mofwqa.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url);

const main = async () => {
  try {
    await client.connect();
    console.log("Connection Success");
    // await dataBasesLists(client);
  } catch (e) {
    console.log(e);
  }
};

main();

// Registration API
app.post("/register", async (req, res) => {
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    dob: req.body.dob,
    phonenumber: req.body.phonenumber,
    address: req.body.address,
    certificates: [],
    scores: [0],
  };

  const result = await client
    .db("prabisha")
    .collection("users")
    .insertOne(user);
  console.log("User Details Registered Successfully");
    res.header('Access-Control-Allow-Origin', '*');
      res.json(result);
});

// Login API
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const login = await client
    .db("prabisha")
    .collection("users")
    .findOne({ email: email, password: password });
  if (login) {
        res.header('Access-Control-Allow-Origin', '*');


      res.json({ message: "User authenticated successfully" });
    console.log("Login Success");
  } else {
    const failed = {
      status: 500,
      description: "Failed",
    };
      res.header('Access-Control-Allow-Origin', '*');

    res.json(failed);
    console.log("Login failed");
  }
});

app.listen(3003, () => {
  console.log("Server listening on port 3002");
});

// Test API
app.get("/", (req, res) => {
  console.log("Test API");
  
  res.header('Access-Control-Allow-Origin', '*');
  res.send("Test API is Working fine!");
});

// Define an API endpoint that retrieves the sum of the numbers array for a given email
app.get("/score/:email", async (req, res) => {
  try {
    // Retrieve the email parameter from the request
    const email = req.params.email;

    // Find the user document with the given email
    const person = await client
      .db("prabisha")
      .collection("users")
      .findOne({ email });
    console.log(person);
    // If the user doesn't exist, return an error response
    if (!person) {
        res.header('Access-Control-Allow-Origin', '*');

      return res.status(404).json({ error: "User not found" });
    }

    // Loop through the array and sum the numbers field
    let sum = 0;
    person.scores.forEach((obj) => {
      sum += obj.numbers.reduce((total, current) => total + current, 0);
    });

    // Return the sum as a response
    res.json({ sum });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
      res.header('Access-Control-Allow-Origin', '*');

    res.status(500).json({ error: "Internal server error" });
  }
});

// Define an API endpoint that retrieves the array based on the user's email
app.get("/certificates/:email", async (req, res) => {
  try {
    // Retrieve the email parameter from the request
    const email = req.query.email;

    // Find the document with the given email
    const person = await client
      .db("prabisha")
      .collection("users")
      .findOne({ email });
    console.log(person);
    // If the document doesn't exist, return an error response
    if (!person) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Extract the array from the document
    const certificates = person.certificates;

    // Return the array as a response
      res.header('Access-Control-Allow-Origin', '*');

    res.json({ certificates });
  } catch (err) {
    // Return an error response if an error occurs
    res.header('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: err.message });
  }
});
