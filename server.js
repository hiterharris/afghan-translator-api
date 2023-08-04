const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const server = express();

// const BedtimeRouter = require("./routes/bedtime-story.js");
// const DariRouter = require("./routes/translate/dari.js");
const TranslateRouter = require("./routes/translate.js");
// const RecipesRouter = require("./routes/recipes.js");

server.use(helmet());
server.use(express.json());
server.use(bodyParser.json());

server.get("/", (req, res) => {
  res.send("Dari Translator API");
});

// server.use("/api/bedtime-story", BedtimeRouter);
// server.use("/api/translate/dari", DariRouter);
server.use("/api/translate", TranslateRouter);
// server.use("/api/recipes", RecipesRouter);

module.exports = server;
