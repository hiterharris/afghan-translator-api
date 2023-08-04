const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const server = express();

const TranslateRouter = require("./routes/translate.js");

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(bodyParser.json());

server.get("/", (req, res) => {
  res.send("Dari Translator API");
});

server.use("/api/translate", TranslateRouter);

module.exports = server;
