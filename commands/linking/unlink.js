const { SlashCommandBuilder } = require("discord.js")
const path = require("path"); 

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unlink")
    .setDescription("Unlink your Minecraft account from the Discord bot, this will prevent you from using commands!")
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1),
    async execute(interaction, tools, bot) { 
      const commandPath = path.join(__dirname, "../../commandFunctions", path.basename(__dirname), path.basename(__filename));

      delete require.cache[require.resolve(commandPath)];
      const { command } = require(commandPath);

      await command(interaction, tools, bot);
  }
}