const { SlashCommandBuilder } = require("discord.js")
const fs = require("fs") 
const path = require("path");
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../../config.json"), 'utf8'));
const eventChoices = Object.entries(config.eventReadable).map(([name, value]) => ({ name, value }));

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
          .setChoices(...eventChoices)
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
          .setChoices(...eventChoices)
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
                  .setChoices(...eventChoices)
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
                  .setChoices(...eventChoices)
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
      fs.readFileSync('./blue_events/leaderboard.json', 'utf8')
    );

    const allPlayers = Object.keys(leaderboardData);

    // Filter players based on input and limit to 25
    const results = allPlayers
      .filter(name => name.toLowerCase().includes(userInput.toLowerCase()))
      .slice(0, 25)
      .map(name => ({ name, value: name }));

    await interaction.respond(results);
    },
    async execute(interaction, tools, bot, eventContext) { 
      const commandPath = path.join(__dirname, "../../commandFunctions", path.basename(__dirname), path.basename(__filename));

      delete require.cache[require.resolve(commandPath)];
      const { command } = require(commandPath);

      await command(interaction, tools, bot, eventContext);
  } 
}