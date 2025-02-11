const { Collection, GatewayIntentBits, ActivityType } = require("discord.js")
const discordClient = require("discord.js")
const { readFileSync, readdirSync } = require("fs")

// import and require .env reference
require('dotenv').config();
const { publicToken, devToken } = process.env;

// Calling config and utils file
const config = JSON.parse(readFileSync(`./config.json`, 'utf8'))
const tools = require(`${config.provider == true ? `/home/electrocute4u/bot` : `.`}/utils/functions`)

// Set the bot Token depending on version
let token;
if (config.dev == false) token = publicToken
if (config.dev == true) token = devToken

const bot = new discordClient.Client({
    intents: [
      GatewayIntentBits.Guilds, 
    ],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
})

// Utilize the Hybrid Sharding instead of 
//const Cluster = require('discord-hybrid-sharding');

// Initiate client (with Cluster Manager handling shards)
// const bot = new Client({
//     intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages], // The needed intents for the bot to function
//     shards: Cluster.data.SHARD_LIST, // An array of shards that will get spawned (handled by Cluster Manager)
//     shardCount: Cluster.data.TOTAL_SHARDS, // Total number of shards (handled by Cluster Manager)
// });

// initialize the Client, so we can access the .broadcastEval()
// bot.cluster = new Cluster.Client(bot);

// Command collection
bot.commands = new Collection();
bot.commandArray = [];

// Buttons collection
bot.buttons = new Collection();

// Cooldown collection
bot.cooldown = new Collection(); 

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

// Require functions for handlers (commands, components and events)
const functionFolders = readdirSync(`${config.provider == true ? `/home/electrocute4u/bot` : `.`}/functions`)
for (const folder of functionFolders) {
    const functionFiles = readdirSync(`${config.provider == true ? `/home/electrocute4u/bot` : `.`}/functions/${folder}`).filter((file) => file.endsWith(".js"));
    for (const file of functionFiles)
        require(`${config.provider == true ? `/home/electrocute4u/bot` : `.`}/functions/${folder}/${file}`)(bot);
}

bot.handleEvents();
bot.handleCommands();

// Bot login
bot.login(token);

// Handle and log rejection errors without crashing process
process.on('uncaughtException', (err, origin) => {
    console.log(err.stack)
    tools.CustomLog(`Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

// Handle and log rejection errors without crashing process
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(`Uncaught Exception Monitor:`, err, origin)
});

// Handle and log rejection errors without crashing process
process.on('unhandledRejection', async (reason, promise) => {
  console.log(`Unhandled rejection at:`, promise, `reason:`, reason)
});