const cron = require("node-cron");

function start() {
  cron.schedule("* * * * * *", () => {
    console.log("I'm running every minute");
  });
}

start();
