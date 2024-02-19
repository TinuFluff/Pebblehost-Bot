const { SlashCommandBuilder } = require('discord.js');
const { makeRequest } = require('../../../pebblehost.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server-manage')
    .setDescription('Start, stop, or restart your pebblehost server')
    .addStringOption(option =>
      option.setName('choice')
        .setDescription('Action to take')
        .setRequired(true)
        .addChoices(
          { name: 'Start', value: 'start' },
          { name: 'Stop', value: 'stop' },
          { name: 'Restart', value: 'restart' },
        )),
  async execute(interaction) {
    try {
      const serverID = process.env.PEBBLEHOST_SERVERID;
      const email = process.env.PEBBLEHOST_EMAIL;
      const apiKey = process.env.PEBBLEHOST_APIKEY;
      const allowedRoleId = process.env.PEBBLEHOST_ALLOWEDROLEID;

      const member = interaction.member;

      const isAllowedRole = member.roles.cache.has(allowedRoleId);

      if (!isAllowedRole) {
        return interaction.reply('You do not have the required role to use this command.');
      }

      const choice = interaction.options.getString('choice');

      await makeRequest("sendConsoleCommand", { server_id: serverID, command: choice }, email, apiKey);

      await interaction.reply(`Server ${choice} successful.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while processing your request.');
    }
  }
};