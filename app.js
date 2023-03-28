const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const dbName = "prabisha";
const collectionName = "users";
const app = express();

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
  };

  const result = await client
    .db("prabisha")
    .collection("users")
    .insertOne(user);
  console.log("User Details Registered Successfully");
  res.send("Registration Success");
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
    res.send("Login Success!");
    console.log("Login Success");
  } else {
    const failedLoginData = {
      status: 500,
      description: "Failed",
    };
    res.send(stringify(failedLoginData));
    console.log("Login failed");
  }
});

app.listen(3002, () => {
  console.log("Server listening on port 3002");
});

// Test API
app.get("/", (req, res) => {
  console.log("Test API");
  res.send("Test API is Working fine!");
});
