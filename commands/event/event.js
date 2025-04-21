const { SlashCommandBuilder } = require("discord.js")
const fs = require("fs") 

module.exports = {
    data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Core commands for events")
    .setContexts(0,1,2)
    .setIntegrationTypes(0,1)
    .addSubcommand(subcommand =>
      subcommand
        .setName('current')
        .setDescription('Displays some information for any ongoing event, if there are any.')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('last')
        .setDescription('Display some information about the last event hosted.')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('cooldown')
        .setDescription('Check the event or events coooldown for a event pass holder')
        .addStringOption(option =>
          option
          .setName("player")
          .setDescription("The name of the event pass holder to check the cooldowns for")
          .setRequired(true)
          .setMaxLength(17)
          .setMinLength(1)
          .setAutocomplete(true)
        )
        .addStringOption(option =>
          option
          .setName("event")
          .setDescription("The specific event to get the cooldown for (defaults to all if this field is not included)")
          .setRequired(false)
          .setMinLength(1)
          .setChoices(
            { name: 'Bedwars', value: 'bedwars' },
            { name: 'Block Party', value: 'woolshuffle' },
            { name: 'Floor is Lava', value: 'woolwars' },
            { name: 'Four Corners', value: 'fourcorners' },
            { name: 'Grinch Simulator', value: 'grinchsimulator' },
            { name: 'Mimic', value: 'mimic' },
            { name: 'Musical Chairs', value: 'musicalchairs' },
            { name: 'Red Rover', value: 'redrover' },
            { name: 'Showdown', value: 'showdown' },
            { name: 'Spleef', value: 'spleef' },
            { name: 'TNT Run', value: 'tntrun' },
            { name: 'TNT Tag', value: 'tnttag' },
            { name: 'Turf Wars', value: 'turfwars' },
            { name: 'Waterdrop', value: 'waterdrop' }
          )
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
                    { name: 'Bedwars', value: 'bedwars' },
                    { name: 'Block Party', value: 'woolshuffle' },
                    { name: 'Floor is Lava', value: 'woolwars' },
                    { name: 'Four Corners', value: 'fourcorners' },
                    { name: 'Grinch Simulator', value: 'grinchsimulator' },
                    { name: 'Mimic', value: 'mimic' },
                    { name: 'Musical Chairs', value: 'musicalchairs' },
                    { name: 'Red Rover', value: 'redrover' },
                    { name: 'Showdown', value: 'showdown' },
                    { name: 'Spleef', value: 'spleef' },
                    { name: 'TNT Run', value: 'tntrun' },
                    { name: 'TNT Tag', value: 'tnttag' },
                    { name: 'Turf Wars', value: 'turfwars' },
                    { name: 'Waterdrop', value: 'waterdrop' }
                  )
        )
    )
    .addSubcommandGroup(group =>
        group
          .setName('leaderboard')
          .setDescription('View leaderboard data')
          .addSubcommand(sub =>
            sub
              .setName('all')
              .setDescription('View the full leaderboard')
              .addStringOption(option =>
                option
                  .setName('sort')
                  .setDescription('Sort type for leaderboard')
                  .addChoices(
                    { name: 'Top', value: 'top' },
                    { name: 'Alphabetical', value: 'alphabetical' }
                  )
                  .setRequired(false) // Optional, will default to 'top' in code
              )
           .addStringOption(option =>
                option
                  .setName('event')
                  .setDescription('The event to fetch the leaderboard for')
                  .setRequired(false)
                  .setChoices(
                    { name: 'Bedwars', value: 'bedwars' },
                    { name: 'Block Party', value: 'woolshuffle' },
                    { name: 'Floor is Lava', value: 'woolwars' },
                    { name: 'Four Corners', value: 'fourcorners' },
                    { name: 'Grinch Simulator', value: 'grinchsimulator' },
                    { name: 'Mimic', value: 'mimic' },
                    { name: 'Musical Chairs', value: 'musicalchairs' },
                    { name: 'Red Rover', value: 'redrover' },
                    { name: 'Showdown', value: 'showdown' },
                    { name: 'Spleef', value: 'spleef' },
                    { name: 'TNT Run', value: 'tntrun' },
                    { name: 'TNT Tag', value: 'tnttag' },
                    { name: 'Turf Wars', value: 'turfwars' },
                    { name: 'Waterdrop', value: 'waterdrop' }
                  )
              )
          )
          .addSubcommand(sub =>
            sub
              .setName('player')
              .setDescription('Check the leaderboard for a specific player')
              .addStringOption(option =>
                option
                  .setName('player')
                  .setDescription('The name of the player to check the leaderboard for')
                  .setRequired(true)
                  .setMinLength(1)
                  .setMaxLength(17)
                  .setAutocomplete(true)
              )
              .addStringOption(option =>
                option
                  .setName('event')
                  .setDescription('The event to fetch the leaderboard for')
                  .setRequired(false)
                  .setChoices(
                    { name: 'Bedwars', value: 'bedwars' },
                    { name: 'Block Party', value: 'woolshuffle' },
                    { name: 'Floor is Lava', value: 'woolwars' },
                    { name: 'Four Corners', value: 'fourcorners' },
                    { name: 'Grinch Simulator', value: 'grinchsimulator' },
                    { name: 'Mimic', value: 'mimic' },
                    { name: 'Musical Chairs', value: 'musicalchairs' },
                    { name: 'Red Rover', value: 'redrover' },
                    { name: 'Showdown', value: 'showdown' },
                    { name: 'Spleef', value: 'spleef' },
                    { name: 'TNT Run', value: 'tntrun' },
                    { name: 'TNT Tag', value: 'tnttag' },
                    { name: 'Turf Wars', value: 'turfwars' },
                    { name: 'Waterdrop', value: 'waterdrop' }
                  )
              )
          )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('stats')
        .setDescription('Check the current event stats for a player')
        .addStringOption(option =>
          option
          .setName("player")
          .setDescription("The name of the player to check the stats for")
          .setRequired(true)
          .setMaxLength(17)
          .setMinLength(1)
          .setAutocomplete(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand
          .setName('random')
          .setDescription('Unsure what event to host? Let the bot decide for you!')
    ),
    async autoComplete(interaction) {
    // Ensure the focused option is the 'player' input field
    const focusedOption = interaction.options.getFocused(true); // get both name and value
    if (focusedOption.name !== 'player') return;

    const userInput = focusedOption.value;

    // Avoid errors on empty input
    if (!userInput || userInput.length < 1) {
      return interaction.respond([]); // Return no suggestions
    }

    // Load leaderboard data
    const leaderboardData = JSON.parse(
      fs.readFileSync('./blooby_event/leaderboard.json', 'utf8')
    );

    const allPlayers = Object.keys(leaderboardData);

    // Filter players based on input and limit to 25
    const results = allPlayers
      .filter(name => name.toLowerCase().includes(userInput.toLowerCase()))
      .slice(0, 25)
      .map(name => ({ name, value: name }));

    await interaction.respond(results);
    },
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