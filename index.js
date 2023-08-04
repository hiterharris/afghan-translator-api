const app = require("./server");
const cors = require("cors");

const port = process.env.PORT || 3001;
app.use(cors());
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})