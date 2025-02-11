const { SlashCommandBuilder, ContextMenuCommandBuilder, PermissionFlagsBits } = require("discord.js")
const { readFileSync } = require("fs")
module.exports = {

    data: new ContextMenuCommandBuilder()
    .setName("Current Trials placements")
    .setType(2),
   
}