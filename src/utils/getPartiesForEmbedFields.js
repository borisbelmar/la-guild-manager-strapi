function getPartiesForEmbedFields (allCharactersByParty) {
  const charactersForEmbed = allCharactersByParty.map(party => {
    return party.reduce((acc, character) => ({
        names: `${acc.names}\n${character.name}`,
        ilvl: `${acc.ilvl}\n${character.ilvl}`,
        discord: `${acc.discord}\n<@${character.user.discordId}>`
      }), {
      names: '',
      ilvl: '',
      discord: ''
    })
  })

  const embedFields = charactersForEmbed.map((party, index) => ([
    {
      name: `Party ${index + 1}`,
      value: party.names,
      inline: true
    },
    {
      name: "ilvl",
      value: party.ilvl,
      inline: true
    },
    {
      name: "Discord",
      value: party.discord,
      inline: true
    }
  ]))

  return embedFields.reduce((acc, fields) => [...acc, ...fields], [])
}

module.exports = getPartiesForEmbedFields