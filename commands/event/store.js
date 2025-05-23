const { SlashCommandBuilder } = require("discord.js")
const path = require("path");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("store")
    .setDescription("Check the event pass prices from a server's store")
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .addStringOption(option =>
      option
      .setName("server")
      .setDescription("Select a server (defaults to all servers)")
      .setChoices(  {
        name: "Mineseed",
        value: "mineseed"
      }, {
        name: "TerraeMC",
        value: "terraemc"
      }, {
        name: "ChunkMC",
        value: "chunkmc"
      }, {
        name: "ZedarMC",
        value: "zedarmc"
      })
      .setRequired(false)
    )
    .addStringOption(option =>
      option
      .setName("currency")
      .setDescription("Select a currency to show converted prices in")
      .setChoices({
        name: "Australian Dollar",
        value: "AUD"
      }, {
        name: "US Dollar",
        value: "USD"
      }, {
        name: "Euro",
        value: "EUR"
      }, {
        name: "Canadian Dollar",
        value: "CAD"
      }, {
        name: "Brazilian Real",
        value: "BRL"
      }, {
        name: "Danish Krone",
        value: "DKK"
      }, {
        name: "Norwegian Krone",
        value: "NOK"
      }, {
        name: "Swedish Krona",
        value: "SEK"
      }, {
        name: "New Zealand Dollar",
        value: "NZD"
      }, {
        name: "Zloty (Poland)",
        value: "PLN"
      }, {
        name: "Singapore Dollar",
        value: "SGD"
      }, {
        name: "Hong Kong Dollar",
        value: "HKD"
      })
      .setRequired(false)
    ),
    async execute(interaction, tools, bot) { 
      const commandPath = path.join(__dirname, "../../commandFunctions", path.basename(__dirname), path.basename(__filename));

      delete require.cache[require.resolve(commandPath)];
      const { command } = require(commandPath);

      await command(interaction, tools, bot);
  }
}