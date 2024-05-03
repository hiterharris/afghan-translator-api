const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const statusMonitor = require('express-status-monitor')();
const server = express();
const moesif = require('moesif-nodejs');

const TranslateRouter = require("./routes/translate.js");
const SupportRouter = require("./routes/support.js");
const LogRouter = require("./routes/logs.js");

server.use(require('express-status-monitor')({ title: 'Afghan Translator API' }));
server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(bodyParser.json());

const moesifMiddleware = moesif({
  applicationId: process.env.MOESIF_APPLICATION_ID,
  identifyUser: function (req, res) {
    return req.user ? req.user.id : undefined;
  }
});

server.use(moesifMiddleware);

server.get('/status', statusMonitor.pageRoute);

server.get("/", (req, res) => {
  res.send("Dari Translator API");
});

server.use("/api/translate", TranslateRouter);
server.use("/api/support", SupportRouter);
server.use("/api/logs", LogRouter);

module.exports = server;
