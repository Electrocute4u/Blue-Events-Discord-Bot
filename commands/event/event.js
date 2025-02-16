const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Core commands for events")
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .addSubcommand(subcommand =>
      subcommand
        .setName('current')
        .setDescription('If a event is joinable/active, display info for the current event')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('last')
        .setDescription('Display information about the last event')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('cooldown')
        .setDescription('If a event is joinable/active, display info for the current event')
        .addStringOption(option =>
          option
          .setName("playername")
          .setDescription("The playername of the user to check the cooldowns for")
          .setRequired(true)
          .setMaxLength(17)
          .setMinLength(1)
        )
        .addStringOption(option =>
          option
          .setName("event")
          .setDescription("The specific event to get the cooldown for (defaults to all if this field is not included)")
          .setRequired(false)
          .setMinLength(1)
          .setChoices(
            {
                name: "Block Party",
                value: "woolshuffle"
            }, {
                name: "Floor is Lava",
                value: "woolwars"
            }, {
                name: "Four Corners",
                value: "fourcorners"
            }, {
                name: "Grinch Simulator",
                value: "grinchsimulator"
            }, {
                name: "Mimic",
                value: "mimic"
            }, {
                name: "Musical Chairs",
                value: "musicalchairs"
            }, {
                name: "Red Rover",
                value: "redrover"
            }, {
                name: "Showdown",
                value: "showdown"
            }, {
                name: "Spleef",
                value: "spleef"
            }, {
                name: "TNT Run",
                value: "tntrun"
            }, {
                name: "TNT Tag",
                value: "tnttag"
            }, {
                name: "Turf Wars",
                value: "turfwars"
            }, {
                name: "Waterdrop",
                value: "waterdrop"
            }
        )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('stats')
        .setDescription('Check the current event stats for a player')
        .addStringOption(option =>
          option
          .setName("playername")
          .setDescription("The playername of the user to check the stats for")
          .setRequired(true)
          .setMaxLength(17)
          .setMinLength(1)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('mode')
        .setDescription('Get information about a specific mode (i.e Red Rover, Block Party, Spleef, etc.)')
        .addStringOption(option =>
          option
          .setName("event")
          .setDescription("The specific event to get informations for")
          .setRequired(true)
          .setMinLength(1)
          .setChoices(
            {
                name: "Block Party",
                value: "woolshuffle"
            }, {
                name: "Floor is Lava",
                value: "woolwars"
            }, {
                name: "Four Corners",
                value: "fourcorners"
            }, {
                name: "Grinch Simulator",
                value: "grinchsimulator"
            }, {
                name: "Mimic",
                value: "mimic"
            }, {
                name: "Musical Chairs",
                value: "musicalchairs"
            }, {
                name: "Red Rover",
                value: "redrover"
            }, {
                name: "Showdown",
                value: "showdown"
            }, {
                name: "Spleef",
                value: "spleef"
            }, {
                name: "TNT Run",
                value: "tntrun"
            }, {
                name: "TNT Tag",
                value: "tnttag"
            }, {
                name: "Turf Wars",
                value: "turfwars"
            }, {
                name: "Waterdrop",
                value: "waterdrop"
            }
        )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('leaderboard')
        .setDescription('Get the overall top wins or from a specific event category')
        .addStringOption(option =>
          option
          .setName("event")
          .setDescription("The event to fetch the leaderboard for")
          .setRequired(true)
          .setMinLength(1)
          .setChoices(
            {
                name: "Block Party",
                value: "woolshuffle"
            }, {
                name: "Floor is Lava",
                value: "woolwars"
            }, {
                name: "Four Corners",
                value: "fourcorners"
            }, {
                name: "Grinch Simulator",
                value: "grinchsimulator"
            }, {
                name: "Mimic",
                value: "mimic"
            }, {
                name: "Musical Chairs",
                value: "musicalchairs"
            }, {
                name: "Red Rover",
                value: "redrover"
            }, {
                name: "Showdown",
                value: "showdown"
            }, {
                name: "Spleef",
                value: "spleef"
            }, {
                name: "TNT Run",
                value: "tntrun"
            }, {
                name: "TNT Tag",
                value: "tnttag"
            }, {
                name: "Turf Wars",
                value: "turfwars"
            }, {
                name: "Waterdrop",
                value: "waterdrop"
            }
        )
        )
        
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