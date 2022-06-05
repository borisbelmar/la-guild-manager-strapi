'use strict';
const { Client, Intents } = require('discord.js');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],

      async beforeCreate({ params }) {
        const data = params.data
        const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });
        await client.login(process.env.DISCORD_BOT_SECRET)

        const guild = await client.guilds.fetch('947270553075613807')
        const members = await guild.members.fetch()
        const member = members.find(m => `${m.user.username}#${m.user.discriminator}` === data.discordUsername)
        if (member) {
          data.discordId = member.user.id
        }
      },
    })
  },
};
