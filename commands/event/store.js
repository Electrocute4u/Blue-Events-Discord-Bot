const { SlashCommandBuilder } = require("discord.js")

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
    async execute(interaction, bot) {
      const {readFileSync} = require("fs")

      // Calling config and utils file
      const config = JSON.parse(readFileSync(`./config.json`, 'utf8'))
      const tools = require(`${config.provider == true ? `/home/electrocute4u/bot` : `../..`}/utils/functions`)
      
      // Acquire file name and folder name
      let dir = config.dev == true ? __dirname.split(`\\`).slice(-1)[0] : __dirname.split(`/`).slice(-1)[0]
      let fileName = config.dev == true ? __filename.split(`\\`).slice(-1)[0] : __filename.split(`/`).slice(-1)[0]
 
      // Delete and reacquire the cache of command function
      delete require.cache[require.resolve(`${config.provider == true ? `/home/electrocute4u/bot` : `../..`}/commandFunctions/${dir}/${fileName}`)];
      
      // Executing the command file
      const commandFile = require(`${config.provider == true ? `/home/electrocute4u/bot` : `../..`}/commandFunctions/${dir}/${fileName}`)
      await commandFile.command(interaction, tools, bot)
    } 
}