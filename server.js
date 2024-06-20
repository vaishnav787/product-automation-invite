// server.js
const express = require("express");
const { runAutomation } = require("./automate_spec.test");

const app = express();
const port = 3000;

app.get("/run-automation", async (req, res) => {
  try {
    await runAutomation();
    res.status(200).send("Automation executed successfully!");
  } catch (error) {
    console.error("Error running automation:", error.message);
    res.status(500).send(`Automation failed: ${error.message}`);
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});
