import express from "express";
import "dotenv/config";
import promptfoo, { assertions } from "promptfoo";

const app = express();
const port = parseInt(process.env.PORT);
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Promptfoo Server running");
});

app.post("/", async (req, res) => {
  const result = await promptfoo.evaluate(req.body);
  res.send(result);
});

app.listen(port, () => {
  console.log(`promptfoo-server listening on port ${port}`);
});
