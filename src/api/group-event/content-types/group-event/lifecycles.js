const axios = require("axios");
const { format } = require("date-fns");
const getAllPartyMembers = require("../../../../utils/getAllPartyMembers");
const getPartiesForEmbedFields = require("../../../../utils/getPartiesForEmbedFields");


module.exports = {
  async afterUpdate(event) {
    const { result } = event
    const { title, startAt, parties, event_type } = result

    const eventTypePopulated = await strapi.entityService.findOne(
      'api::event-type.event-type',
      event_type.id,
      {
        populate: { image: true }
      }
    )

    const allMembers = getAllPartyMembers(parties)

    const allCharactersDetailByParty = await Promise.all(
      allMembers.byParty.map(party => (
        Promise.all(party.map(member => (
          strapi.entityService.findOne(
            'api::character.character',
            member.id,
            {
              populate: { user: true }
            }
          )
        ))
      )))
    )
  
    const startAtFormatted = format(new Date(startAt), 'dd-MM-yyyy HH:mm', { timeZone: 'AST' })

    const embedFields = getPartiesForEmbedFields(allCharactersDetailByParty)

    const payload = {
      embeds: [
        {
          title,
          description: `Recuerden llevar pociones e items.\nHorario del evento ${startAtFormatted} AST`,
          url: 'https://www.youtube.com/shorts/8XOIM9BuyLA',
          image: {
            url: eventTypePopulated.image.formats.large.url,
          },
          author: {
            name: 'Raid',
            icon_url: 'https://media.discordapp.net/attachments/842356473996247082/978407996461813780/unknown.png?width=676&height=676'
          },
          thumbnail: {
            url: "https://media.discordapp.net/attachments/947275992743952474/978274081742942268/Screenshot_4.png"
          },
          timestamp: new Date().toISOString(),
          footer: {
            text: "Helheimr Guild",
            icon_url: "https://media.discordapp.net/attachments/947275992743952474/978274081742942268/Screenshot_4.png"
          },
          color: 16711680,
          fields: embedFields
        }
      ]
    }

    axios.post(process.env.DISCORD_WEBHOOK_URL, payload)
  },
};
