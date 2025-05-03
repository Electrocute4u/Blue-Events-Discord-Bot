const { Collection, GatewayIntentBits, ActivityType, Client } = require("discord.js");
const { readFileSync, readdirSync } = require("fs");
const path = require("path");

require("dotenv").config();
const { publicToken, devToken } = process.env;

// Load config and utilities
const config = JSON.parse(readFileSync(path.join(__dirname, "config.json"), "utf8"));
const tools = require(path.join(__dirname, "utils/functions"));
const statsManager = require(path.join(__dirname, "utils/statsManager"));
const leaderboardManager = require(path.join(__dirname, "utils/leaderboardManager"));

const token = config.dev ? devToken : publicToken;

const bot = new Client({
  intents: [GatewayIntentBits.Guilds],
  allowedMentions: { parse: ["users", "roles"], repliedUser: true }
});

bot.commands = new Collection();
bot.commandArray = [];
bot.buttons = new Collection();
bot.cooldown = new Collection();

// Load all function handlers
const functionFolders = readdirSync(path.join(__dirname, "functions"));
for (const folder of functionFolders) {
  const functionFiles = readdirSync(path.join(__dirname, "functions", folder)).filter(f => f.endsWith(".js"));
  for (const file of functionFiles) {
    require(path.join(__dirname, "functions", folder, file))(bot);
  }
}

bot.handleEvents();
bot.handleCommands();

bot.login(token);

// Pick presence
// bot.pickPresence = async () => {
//   const options = [
//     {
//         type: ActivityType.Custom,
//         text: "🔮 Battling players in Redroover",
//         status: "online"
//     }
// ];
    
//     const option = Math.floor(Math.random() * options.length)

//     bot.user.setPresence({
//         activities: [
//             {
//             name: options[option].text,
//             type: options[option].type,
//             }],
//         status: options[option].status
//     })
// }

// Handle and log errors
process.on("uncaughtException", (err, origin) => {
  console.log(err.stack);
  tools.CustomLog(`Caught exception: ${err}\nException origin: ${origin}`, "Error");
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log("Uncaught Exception Monitor:", err, origin);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled rejection at:", promise, "reason:", reason);
});

// Graceful shutdown to flush caches
const gracefulShutdown = async () => {
  try {
    tools.CustomLog("Initiating graceful shutdown...", "Info");

    // Flush all branch stats and leaderboard caches
    await statsManager.flushAll();
    await leaderboardManager.flushAll();

    tools.CustomLog("All caches flushed successfully. Shutting down.", "Info");
    process.exit(0);
  } catch (error) {
    tools.CustomLog(`Error during shutdown: ${error}`, "Error");
    process.exit(1);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
