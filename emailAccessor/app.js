const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");

// Using express
const app = express();

// Body parser
app.use(bodyParser.json());

// Set browser permissions
app.use(cors());

// Env variables
dotenv.config({ path: "../.env" });

// SendGrid api key set
sgMail.setApiKey(process.env.MAIL_API_KEY);

// Helper function to load and compile the HTML template
const loadTemplate = (name, articlesHtml) => {
  const templatePath = path.join(__dirname, "emailTemplate.html");
  let template = fs.readFileSync(templatePath, "utf8");
  template = template.replace("{{name}}", name);
  return template.replace("{{articles}}", articlesHtml);
};

// Route to handle emailing submission
app.post("/email", async (req, res) => {
  try {
    console.log("asked for Email Post Method");

    const { emailTo, name, articles } = req.body;
    console.log(emailTo);
    // console.log(name);
    // console.log(articles);

    // Generate HTML for articles with images and links
    const articlesHtml = articles
      .map((article) => {
        // Use default image if image_url is null
        const imgUrl = article.image_url || process.env.DEFAULT_IMAGE_URL;
        return `
          <div class="article">
            <a href="${article.link}" target="_blank">
              <img src="${imgUrl}" alt="${article.title}">
              <h2>${article.title}</h2>
            </a>
          </div>
        `;
      })
      .join("");

    // Load and compile the HTML template
    const htmlContent = loadTemplate(name, articlesHtml);

    const msg = {
      to: emailTo, // Recipient email
      from: "yakprog@gmail.com", // Verified sender
      subject: "NewsIQ Newsletter - AI Articles Request",
      html: htmlContent,
    };

    sgMail
      .send(msg)
      .then((response) => {
        // console.log(response[0].statusCode);
        // console.log(response[0].headers);
      })
      .catch((error) => {
        console.error(error);
      });

    res.status(200).send(`Email sent to ${msg.to}`);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

const EMAIL_PORT = process.env.EMAIL_PORT;
// Start the server
app.listen(EMAIL_PORT, () => {
  console.log(`Emailing Server started on port: ${EMAIL_PORT}`);
});
