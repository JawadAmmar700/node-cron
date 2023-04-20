const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require("node-cron");

// require("./monitor");

app.use(bodyParser.json());
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

app.get("/", (req, res) => {
  res.send("Hey there!, this is a server that is used by the senior project");
});

app.post("/", (req, res) => {
  cron.schedule("*/3 * * * * *", () => {
    console.log("I'm running every 3 s");
  });
  res.json({ message: "I'm running every 3 s" });
});

app.listen(4000);
