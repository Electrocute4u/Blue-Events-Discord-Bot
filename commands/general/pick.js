const { SlashCommandBuilder } = require("discord.js")
const path = require("path");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pick")
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .setDescription("Let the bot pick a choice for you!")
    .addStringOption(option =>
        option
        .setName("choices")
        .setDescription("Choice1, Choice2, Choice3 etc...")
        .setRequired(true)
    ),
    async execute(interaction, tools, bot) { 
      const commandPath = path.join(__dirname, "../../commandFunctions", path.basename(__dirname), path.basename(__filename));

      delete require.cache[require.resolve(commandPath)];
      const { command } = require(commandPath);

      await command(interaction, tools, bot);
  }
}