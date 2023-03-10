require("dotenv").config();
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const logger = require("morgan");
const notFound = require("./middleware/not-found");
const error = require("./middleware/error");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // 100 requests per 15 min
  })
);

const logFormat = process.env.NODE_ENV === "production" ? "tiny" : "dev";
app.use(logger(logFormat));

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Getreply" });
});

app.post("/", async (req, res, next) => {
  try {
    const { prompt } = req.body;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).json({
      reply: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    next(err);
  }
});

app.use(notFound);
app.use(error);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
