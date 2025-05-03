const { REST, Routes } = require("discord.js");
const path = require("path");
const { readdirSync, readFileSync } = require("fs");

// Load environment variables
require("dotenv").config();

module.exports = (bot) => {
  bot.handleCommands = async () => {
    // Load config
    const configPath = path.join(__dirname, "../../config.json");
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    const tools = require(path.join(__dirname, "../../utils/functions"));

    const devCommands = [];
    const partnerOnlyCommands = [];

    const commandFolders = readdirSync(path.join(__dirname, "../../commands"));
    for (const folder of commandFolders) {
      const commandFiles = readdirSync(path.join(__dirname, "../../commands", folder)).filter(file => file.endsWith(".js"));

      const { commands, commandArray } = bot;
      for (const file of commandFiles) {
        const commandPath = path.join(__dirname, "../../commands", folder, file);
        const command = require(commandPath);
        commands.set(command.data.name, command);

        if (folder.toLowerCase() === "admin") devCommands.push(command.data.name.toLowerCase());
        if (command.partnerOnly) partnerOnlyCommands.push(command.data.name.toLowerCase());

        commandArray.push(command.data.toJSON());
      }
    }

    // Refresh config again
    const { dev, slashGuildID, slashGuildIDPublic } = JSON.parse(readFileSync(configPath, "utf8"));

    const token = dev ? process.env.devToken : process.env.publicToken;
    const clientId = dev ? process.env.devClientID : process.env.publicClientID;
    const guildId = dev ? slashGuildID : slashGuildIDPublic;

    const rest = new REST({ version: "10" }).setToken(token);

    try {
      if (!dev) {
        // 💥 DELETE all local Dev Server (guild) commands
        tools.CustomLog("Deleting all local guild (/) commands from Dev Server...", "Info");

        const commandsInGuild = await rest.get(Routes.applicationGuildCommands(clientId, slashGuildID));
        const deletePromises = commandsInGuild.map(cmd => 
          rest.delete(Routes.applicationGuildCommand(clientId, slashGuildID, cmd.id))
        );
        await Promise.all(deletePromises);

        tools.CustomLog(`Successfully deleted ${commandsInGuild.length} guild (/) commands from Dev Server`, "Info");
      }

      if (!dev) {
        tools.CustomLog("[PUBLIC] Uploading Public Global Commands...", "Info");

        // Upload all public commands EXCEPT dev-only and partner-only commands
        const globalCommands = bot.commandArray.filter(cmd => 
          !devCommands.includes(cmd.name) && !partnerOnlyCommands.includes(cmd.name)
        ); 
        try {
          tools.CustomLog(`[PUBLIC] Registering ${globalCommands.length} global commands...`, "Info");
          const res = await rest.put(Routes.applicationCommands(clientId), { body: globalCommands });
          tools.CustomLog(`[PUBLIC] ✅ Registered ${res.length} global commands.`, "Success");
        } catch (err) {
          tools.CustomLog("❌ Failed to register global commands", "Error");
          console.error(err);
        }

        tools.CustomLog("[PUBLIC] Uploading Partner Only (/) Commands to Partnered Servers...", "Info");

        const allPartners = config.branches.flatMap(branch => 
          (branch[Object.keys(branch)[0]].partners || []).map(p => ({
            guildId: p.discord,
            guildName: p.name
          }))
        );
        
        const partnerOnlyArray = bot.commandArray.filter(cmd => 
          partnerOnlyCommands.includes(cmd.name)
        );
        
        for (const { guildId, guildName } of allPartners) {
          try {
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: partnerOnlyArray });
            tools.CustomLog(`✅ Registered Partner Only (/) Commands to Partner Guild: ${guildName} (${guildId})`, "Info");
          } catch (err) {
            tools.CustomLog(`❌ Partner ${guildName} (${guildId}) is missing. Error: ${err.message}`, "Error");
          }
        }
        

        tools.CustomLog("[PUBLIC] Uploading Admin (Dev) Commands Locally to Support Server...", "Info");

        const onlyDevForSupportServer = bot.commandArray.filter(cmd => 
          devCommands.includes(cmd.name)
        );

        await rest.put(Routes.applicationGuildCommands(clientId, slashGuildID), { body: onlyDevForSupportServer }); 
      }

      if (dev) {
        tools.CustomLog("[DEV] Uploading Dev Server (/) Commands...", "Info");

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: bot.commandArray });
      }

      tools.CustomLog("✅ Successfully registered all application (/) commands!", "Info");

    } catch (error) {
      console.error(error);
      tools.CustomLog(error, "Error");
    }
  };
};
