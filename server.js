const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const server = express();
const moesif = require('moesif-nodejs');

const TranslateRouter = require("./routes/translate.js");
const TextToSpeechRouter = require("./routes/tts.js");
const OCRRouter = require("./routes/ocr.js");

server.use(cors());
server.use(helmet());
server.use(express.json());
// server.use(bodyParser.json());
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const moesifMiddleware = moesif({
  applicationId: process.env.MOESIF_APPLICATION_ID,
  identifyUser: function (req, res) {
    return req.user ? req.user.id : undefined;
  }
});

server.use(moesifMiddleware);

server.get("/", (req, res) => {
  res.send("Dari Translator API");
});

server.use("/api/translate", TranslateRouter);
server.use("/api/tts", TextToSpeechRouter);
server.use("/api/ocr", OCRRouter);

module.exports = server;
