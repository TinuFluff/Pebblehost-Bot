const { SlashCommandBuilder } = require('discord.js');
const { makeRequest } = require('../../../pebblehost.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('whitelist')
      .setDescription('Add/remove a user to/from the whitelist')
      .addStringOption(option =>
        option.setName('user')
          .setDescription('User to whitelist')
          .setRequired(true))
      .addStringOption(option =>
          option.setName('action')
          .setDescription('Action')
          .setRequired(true)
          .addChoices(
              { name: 'Add', value: 'add' },
              { name: 'Remove', value: 'remove' },
          )
      ),
  async execute(interaction) {
    const user = interaction.options.getString('user');
    const action = interaction.options.getString('action');

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
      
      await makeRequest("sendConsoleCommand", { server_id: serverID, command: `whitelist ${action} ${user}` }, email, apiKey);

      await interaction.reply(`User ${user} ${action}ed to/from whitelist successfully.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while processing your request.');
    }
  }
};