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

// dapr client
const daprHost = process.env.DAPR_HOST;
const daprPort = process.env.DAPR_PORT;
const client = new DaprClient(daprHost, daprPort);

// subscription to the queuelisten - queue url
app.post("/queuelisten", async (req, res) => {
  const email = req.body.data.email;

  if (!email) {
    console.error("Email is required in the request body");
    return res.sendStatus(400);
  }

  try {
    // Process the request only if the email is present
    const response = await client.invoker.invoke(
      "dbaccessor-service",
      `/user?email=${email}`,
      HttpMethod.GET
    );

    //console.log(response);

    if (response === "User not found") {
      console.log(`User not found, email: ${email} doesn't exist in DB!`);
      return res.status(200).send({ error: "User not found" });
    }

    console.log("User found:", response);

    // we got the user from DB

    const userName = response.name;
    const userEmail = response.email;
    const userDescription = response.description;

    // AI decide the best categories by user description

    const getCategoriesByAI = await client.invoker.invoke(
      "aiaccessor-service",
      "/categories",
      HttpMethod.POST,
      {
        description: userDescription,
      }
    ); // Exmaple : [ "Sports","Science","Technology","Lifestyle" ]

    // console.log(getCategoriesByAI);

    // newsdata.io api call
    // Returns list of articles that match the user according to the user categories

    const getArticles = await client.invoker.invoke(
      "newsaccessor-service",
      "/news",
      HttpMethod.POST,
      {
        categories: getCategoriesByAI,
      }
    );

    //console.log(getArticles);

    // AI api call
    // Returns articles indexes of the best match between the arcticles we got and the user description

    const getArticlesIndexesByAI = await client.invoker.invoke(
      "aiaccessor-service",
      "/articles",
      HttpMethod.POST,
      {
        description: userDescription,
        articles: getArticles,
      }
    );

    //console.log(getArticlesIndexesByAI.indexes);

    // Filtering the best indexes and return the relevant articles

    const filteredArticles = getArticlesIndexesByAI.indexes.map((index) => {
      const article = getArticles[index];
      return {
        title: article.title,
        link: article.link,
        image_url: article.image_url,
      };
    });

    //console.log(filteredArticles);

    // SendGrid emailing API - sending the articles by title, link, image to the user Email

    const sendEmail = await client.invoker.invoke(
      "emailaccessor-service",
      "/email",
      HttpMethod.POST,
      {
        emailTo: userEmail,
        name: userName,
        articles: filteredArticles,
      }
    );

    console.log(sendEmail);

    // status 200 - request out from the queue
    res.sendStatus(200);
  } catch (error) {
    console.error("Error: ", error.message);
    res.sendStatus(500);
  }
});

const SUB_MANAGER_PORT = process.env.SUB_MANAGER_PORT;
// Start the server
app.listen(SUB_MANAGER_PORT, () => {
  console.log(`SUB-Manager Server started on port: ${SUB_MANAGER_PORT}`);
});
