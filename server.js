const express = require("express");
const server = express();
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const { moesifMiddleware } = require('./middleware');

const TranslateRouter = require("./routes/translate.js");
const TextToSpeechRouter = require("./routes/tts.js");

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(bodyParser.json());

moesifMiddleware.startCaptureOutgoing();
server.use(moesifMiddleware);

server.get("/", (req, res) => {
  res.send("Dari Translator API");
});

server.use("/api/translate", TranslateRouter);
server.use("/api/tts", TextToSpeechRouter);

module.exports = server;
