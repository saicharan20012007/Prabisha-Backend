const express = require("express");
const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieParser = require('cookie-parser');
// const cookieSession = require('cookie-session');

// const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieSession({
//   name: 'session',
//   keys: ['key1', 'key2']
// }));


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

      const success = {
      status: 200,
      description: "Success",
    };
      res.header('Access-Control-Allow-Origin', '*');
        res.json(success);
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

      const success = {
      status: 200,
      description: "Success",
    };
      res.json(success);
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

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

// Test API
app.get("/test", (req, res) => {
  console.log("Test API");
  res.header('Access-Control-Allow-Origin', '*');
  res.send("Test API is Working fine!");
});

