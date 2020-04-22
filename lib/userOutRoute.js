const User = require('./../app/models/user')
const Hand = require('./../app/models/hand')
// const ObjectId = require('mongodb').ObjectID

// when join a table, create hand and update
const createUsersHand = function (data, id) {
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
    let newHand = ''
    if (handsUpdate[i] !== []) {
      newHand = newHand + handsUpdate[i][0]
      newHand = newHand + handsUpdate[i][1]
    }
    console.log(newHand)
    const createdHand = {
      hand: {
        cards: newHand,
        current_bet: 0,
        owner_name: 'George',
        owner: playerArray[i]
      }
    }
    console.log(createdHand)
    Hand.create(createdHand.hand)
      .then(newHand => {
        console.log('hand')
        console.log(newHand)
        User.findByIdAndUpdate(playerArray[i], { $addToSet: { hand: newHand } }, { new: true, useFindAndModify: false })
          .then(hand => console.log(hand))
      })
      .catch(error => {
        console.log('break')
        console.log(error)
      })
  }
}

// deal out one persons cards
const updateOneUsersCards = function (newCard, player) {
  console.log(player)
  User.findById({ _id: player })
    .then(user => {
      Hand.find({ owner: player })
        .then(hand => {
          console.log(hand)
          let cards = hand[0].cards
          cards = cards + newCard
          console.log(cards)
          console.log(hand[0]._id)
          Hand.findByIdAndUpdate(hand[0]._id, { cards: cards })
            .then(hands => {
              return hands
            })
            .catch(error => console.log(error))
        })
        .catch(console.error)
    })
    .catch(error => console.log(error))
}

const clearHands = function (player) {
  Hand.remove({ owner: player })
    .then(() => {
      let a = {}
      return a.sendStatus(204)
    })
}

module.exports = {
  createUsersHand,
  updateUsersCards,
  updateOneUsersCards,
  deleteUsersHand,
  clearHands
}
