import express from "express";
import "dotenv/config";

const app = express();
const port = parseInt(process.env.PORT);

app.get("/", (req, res) => {
  res.send("Helgewgewlo few!");
});

app.listen(port, () => {
  console.log(`promptfoo-server listening on port ${port}`);
});
