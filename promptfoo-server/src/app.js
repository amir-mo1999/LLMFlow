import express from "express";
import "dotenv/config";
import promptfoo, { assertions } from "promptfoo";

const app = express();
const port = parseInt(process.env.PORT);

app.get("/", async (req, res) => {
  const results = await promptfoo.evaluate(
    {
      prompts: [
        [{ role: "user", content: "Rephrase this in French: {{body}}" }],
      ],
      providers: ["openai:gpt-3.5-turbo"],
      defaultTest: {
        assert: [
          { type: "contains", value: "B", weight: 0.5 },
          { type: "contains", value: "Bhtrjh" },
        ],
      },
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
