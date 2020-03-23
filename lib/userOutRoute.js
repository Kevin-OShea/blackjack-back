const User = require('./../app/models/user')
const Hand = require('./../app/models/hand')
// const ObjectId = require('mongodb').ObjectID

// when join a table, create hand and update
const createUsersHand = function (data, id) {
  console.log(data.owner)
  console.log('running')
  User.findByIdAndUpdate(data.owner, { $addToSet: { hand: data } }, { new: true, useFindAndModify: false })
    .then(hand => console.log(hand))
    .catch(error => console.log(error))
}

// used to reset all users hand arrays
const deleteUsersHand = function (data, id) {
  console.log(data.owner)
  console.log('running')
  User.findByIdAndUpdate(data.owner, { $set: { hand: [] } }, { new: true, useFindAndModify: false })
    .then(hand => console.log(hand))
    .catch(error => console.log(error))
}

// deal out the original cards
const updateUsersCards = function (hands, players) {
  const playerArray = players.players
  for (let i = 0; i < playerArray.length; i++) {
    const handsUpdate = hands.update.data
    User.findById({ _id: playerArray[i] })
      .then(user => {
        // console.log(user.hand)
        const fake = user.hand[user.hand.length - 1]
        if (handsUpdate[i] !== []) {
          let newHand = ''
          newHand = newHand + handsUpdate[i][0]
          newHand = newHand + handsUpdate[i][1]
          Hand.findByIdAndUpdate(fake, { cards: newHand })
            .then(hands => console.log('break'))
            .catch(error => console.log(error))
        }
      })
      .catch(error => console.log(error))
  }
}

module.exports = {
  createUsersHand,
  updateUsersCards,
  deleteUsersHand
}
