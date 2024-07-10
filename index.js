const app = require("./server");
const { logger } = require("./middleware");

const port = process.env.PORT || 3001;
app.listen(port, () => {
  logger.info(`\n\nAfghan Translator API v1.3 \n\nServer listening on port ${port}`)
});
