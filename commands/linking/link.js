const { SlashCommandBuilder } = require("discord.js");
const path = require("path"); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName("link")
        .setDescription("Link your Minecraft user to the Discord bot!")
        .setContexts(0)
        .setIntegrationTypes(0)
        .addStringOption(option =>
            option
                .setName('user')
                .setDescription('Your Minecraft Username, UUID or XUID')
                .setRequired(true)
        ),
    partnerOnly: true,
        async execute(interaction, tools, bot) { 
            const commandPath = path.join(__dirname, "../../commandFunctions", path.basename(__dirname), path.basename(__filename));
      
            delete require.cache[require.resolve(commandPath)];
            const { command } = require(commandPath);
      
            await command(interaction, tools, bot);
        }
};
