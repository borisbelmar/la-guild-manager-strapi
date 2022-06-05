const { ValidationError } = require("@strapi/utils").errors

function getAllPartyMembers (parties) {
  const allMembers = {
    withKeys: {},
    byParty: []
  }

  parties.forEach(party => {
    const { member1, member2, member3, member4 } = party

    const filtered = [member1, member2, member3, member4].filter(member => !!member)
    
    filtered.forEach(member => {
      if (!!allMembers.withKeys[member.id]) {
        throw new ValidationError(`Duplicate party member: ${member.name}`)
      }

      allMembers.withKeys[member.id] = member
    })

    allMembers.byParty.push(filtered)
  })

  return allMembers
}

module.exports = getAllPartyMembers
