import express from "express";
import "dotenv/config";
import promptfoo from "promptfoo";

const app = express();
const port = parseInt(process.env.PORT);

app.get("/", async (req, res) => {
  const results = await promptfoo.evaluate(
    {
      prompts: [
        "Rephrase this in French: {{body}}",
        "Rephrase this like a pirate: {{body}}",
      ],
      providers: ["openai:gpt-4o-mini"],
      tests: [
        {
          vars: {
            body: "Hello world",
          },
        },
        {
          vars: {
            body: "I'm hungry",
          },
        },
      ],
      writeLatestResults: true, // write results to disk so they can be viewed in web viewer
    },
    {
      maxConcurrency: 2,
    }
  );

  res.send(results);
});

app.listen(port, () => {
  console.log(`promptfoo-server listening on port ${port}`);
});
