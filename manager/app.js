const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const { DaprClient, HttpMethod } = require("@dapr/dapr");

// Using express
const app = express();

// Body parser - app/json format.
app.use(bodyParser.json({ type: "application/*+json" }));
// app.use(bodyParser.json());

// Set browser permissions.
app.use(cors());

// Env variables
dotenv.config({ path: "../.env" });

// Create Dapr client
const daprHost = process.env.DAPR_HOST;
const daprPort = process.env.DAPR_PORT;
const client = new DaprClient(daprHost, daprPort);

// Route to handle manager submission - Queueing with dapr and radis
app.get("/manager", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res
        .status(400)
        .send({ error: "Email query parameter is required" });
    }

    // Queueing msg
    const response = await client.pubsub.publish("pubsub", "msgqueue", {
      email: email,
    });

    res.status(202).send(`Hi, Request for ${email} Accepted!`); // Change status to 202 Accepted
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const MANAGER_PORT = process.env.MANAGER_PORT;

app.listen(MANAGER_PORT, () => {
  console.log(`Manager Server started on port: ${MANAGER_PORT}`);
});
