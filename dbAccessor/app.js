const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const mongoose = require("mongoose");
const users = require("./models/users");

// Using express
const app = express();

// Body parser - app/json format.
// app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.json());

// Set browser permissions.
app.use(cors());

// Env variables
dotenv.config({ path: "../.env" });

// Define the GET function
app.get("/user", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      // Check if email parameter is present
      return res
        .status(400)
        .send({ error: "Email query parameter is required" });
    }

    // checking user matching
    const user = await users.aggregate([
      {
        $match: { email: email },
      },
    ]);

    if (user.length === 0) {
      // Check if user exists
      return res.status(200).send("User not found");
    }

    res.status(200).send(user[0]);
  } catch (err) {
    // Added error handling
    console.error("Error retrieving user:", err);
    res
      .status(500)
      .send({ error: "An error occurred while retrieving the user" });
  }
});

const DB = process.env.DB;
const DB_PORT = process.env.DB_PORT;

mongoose
  .connect(DB)
  .then((result) => {
    console.log("DB connected!!!");
    app.listen(DB_PORT, () => {
      console.log(`DB Server started on port: ${DB_PORT}`);
    });
  })
  .catch((err) => console.log(err));
