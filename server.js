// server.js
const express = require("express");
const { runAutomation } = require("./automate_spec.test");

const app = express();
const port = 3000;

app.get("/run-automation", async (req, res) => {
  try {
    const channelIds = await runAutomation(); // Get the channel IDs
    res.status(200).json({
      message: "Automation Executed Successfully!",
      channelIds: channelIds // Send the channel IDs in the response
    });
  } catch (error) {
    console.error("Error running automation:", error.message);
    res.status(500).json({
      message: `Automation failed: ${error.message}`,
      channelIds: [] // Send an empty array in case of error
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});
