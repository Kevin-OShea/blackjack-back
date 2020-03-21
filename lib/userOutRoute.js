const User = require('./../app/models/user')
const Hand = require('./../app/models/hand')
// const ObjectId = require('mongodb').ObjectID

const createUsersHand = function (data, id) {
  console.log(data.owner)
  console.log('running')
  User.findByIdAndUpdate(data.owner, { $addToSet: { hand: data } }, { new: true, useFindAndModify: false })
    .then(hand => console.log(hand))
    .catch(error => console.log(error))
}

const updateUsersCards = function (hands, players) {
  console.log(hands.update.data)
  // console.log('i')
  // console.log(players[0].players)
  const playerArray = players[0].players
  for (let i = 0; i < playerArray.length; i++) {
    const handsUpdate = hands.update.data
    console.log(i)
    console.log(playerArray[i])
    User.findById({ _id: playerArray[i] })
      .then(user => {
        console.log(user.hand)
        const fake = user.hand[user.hand.length - 1]
        Hand.findByIdAndUpdate(fake, { cards: handsUpdate[i] })
          .then(hands => console.log('break'))
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
  }
}

module.exports = {
  createUsersHand,
  updateUsersCards
}
