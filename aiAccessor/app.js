const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// Using express
const app = express();

// Body parser - app/json format.
// app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.json());

// Set browser permissions.
app.use(cors());

// Env variables
dotenv.config({ path: "../.env" });

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  // Set the `responseMimeType` to output JSON
  generationConfig: { responseMimeType: "application/json" },
});

// Static Categories equals to NEWSDATA.io list
const categories = [
  "Business",
  "Crime",
  "Domestic",
  "Education",
  "Entertainment",
  "Environment",
  "Food",
  "Health",
  "Lifestyle",
  "Politics",
  "Science",
  "Sports",
  "Technology",
  "Top",
  "Tourism",
  "World",
];

// Route to handle category submission
app.post("/categories", async (req, res) => {
  try {
    console.log("asked for Categories Post Method");

    const description = req.body.description;

    const prompt = `Based on the description of the user: "${description}" give me up to 5 categories that fit best to this user from this list: ${categories}`;

    const result = await geminiModel.generateContent(prompt);

    const response = await result.response;

    const text = response.text();

    res.status(200).send(text);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Route to handle articles submission
app.post("/articles", async (req, res) => {
  try {
    console.log("asked for Articles Post Method");

    const description = req.body.description;
    const articles = req.body.articles;

    const prompt = `Based on the user's description: "${description}" You will return up to 5 indexes of articles that you think are most suitable for this user according to the description field of the article and also take into account the pubDate field so that the indexes that are returned will be more recent. Also, make sure you don't return any article more than once by title!, This is a output form example: { indexes: [ , , , , ] }. These are the articles: ${articles}`;

    const result = await geminiModel.generateContent(prompt);

    const response = await result.response;

    const text = response.text();

    console.log(text);

    res.status(200).send(text);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

const AI_PORT = process.env.AI_PORT;
// Start the server
app.listen(AI_PORT, () => {
  console.log(`ai GEMINI Server started on port: ${AI_PORT}`);
});
