const express = require("express");
const server = express();
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser")
const { moesifMiddleware, rateLimiter } = require('./middleware');

server.use(rateLimiter);
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
server.use(express.json({ limit: '50mb' }));

const TranslateRouter = require("./routes/translate.js");
const TextToSpeechRouter = require("./routes/tts.js");
const UploadRouter = require("./routes/upload.js");

server.use(cors());
server.use(helmet());

moesifMiddleware.startCaptureOutgoing();
server.use(moesifMiddleware);

server.get("/", (req, res) => {
  res.send("Dari Translator API");
});

server.use("/api/translate", TranslateRouter);
server.use("/api/tts", TextToSpeechRouter);
server.use("/api/upload", UploadRouter);

module.exports = server;
