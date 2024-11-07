import express from "express";
import "dotenv/config";
import promptfoo from "promptfoo";

const app = express();
const port = parseInt(process.env.PORT);
app.use(express.json());

app.get("/", async (_, res) => {
  res.send("Promptfoo Server running");
});

app.post("/", async (req, res) => {
  const now = new Date();
  console.log(`${now.toLocaleTimeString()}: request received`);
  const result = await promptfoo.evaluate(req.body, { cache: false });

  const later = new Date();
  console.info(
    `${later.toLocaleTimeString()}: request resolved with Status Code 200`
  );
  res.send(result);
});


app.listen(port, "::", () => {
  console.log(`promptfoo-server listening on port ${port}`);
});
