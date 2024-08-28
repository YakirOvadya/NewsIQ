const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

// Using express
const app = express();

// Body parser - app/json format.
//app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.json());

// Set browser permissions.
app.use(cors());

// Env variables
dotenv.config({ path: "../.env" });

// Route to handle news submission
app.post("/news", async (req, res) => {
  try {
    const categories = req.body.categories;
    // console.log(categories);
    const categoryParam = categories.join(",");
    // console.log(categoryParam);
    const apiUrl = `${process.env.NEWS_API_KEY}${categoryParam}`;

    //console.log(apiUrl);

    // Make the API request using Axios
    const apiResponse = await axios.get(apiUrl);
    console.log(`Axios done for categories: ${categoryParam}`);
    // Return the API response to the client
    res.status(200).send(apiResponse.data.results);
  } catch (error) {
    res.status(500).send("Error fetching news data");
  }
});

const NEWS_PORT = process.env.NEWS_PORT;
// Start the server
app.listen(NEWS_PORT, () => {
  console.log(`NewsDate.io Server started on port: ${NEWS_PORT}`);
});
