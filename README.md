# NewsIQ
# AI Newsletter with Microservices Architecture

The project aims to develop a microservice-based application that aggregates news and technology updates based on user preferences. The system will fetch the latest news, pick up most interesting news using AI based on user preferences (optionally generate concise summaries using AI), and send this information to users via email, Telegram, or other communication channels.

## Installation

make sure you installed docker hub on your computer than:

```bash
# Clone the repository
git clone https://github.com/yakprog/NewsIQ.git

# Navigate to the project directory
cd NewsIQ

# bulid and run docker-compose
docker-compose up -d --build
```

## Running Tests

To run tests, after docker compose finished go to the browser and insert the following url:

```bash
  http://localhost:3005/manager?email=youremail
```

Then check your spam box in the email

## Screenshots

DB Document looks like that:
![DB Screenshot](./images/db.PNG)

When everting works good docker hub will looks like that:
![Docker Screenshot](./images/docker.PNG)

Request:
![Request Screenshot](./images/request.PNG)

Response:
![Response Screenshot](./images/response.PNG)

## Scheme

![Scheme Screenshot](./images/scheme.PNG)

## Author

- Yakir Ovadya, Feel free to contact me: yakprog@gmail.com

