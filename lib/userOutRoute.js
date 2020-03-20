const User = require('./../app/models/user')
// const ObjectId = require('mongodb').ObjectID

const createUsersHand = function (data, id) {
  console.log(data.owner)
  console.log('running')
  User.findByIdAndUpdate(data.owner, { $addToSet: { hand: data } }, { new: true, useFindAndModify: false })
    .then(hand => console.log(hand))
    .catch(error => console.log(error))
}

const updateUsersCards = function (data) {
  const playerArray = data[0].players
  for (let i = 0; i < playerArray.length; i++) {
    const singleUpdate = data.update.data
    // console.log(singleUpdate)
    User.findById({ _id: playerArray[i] })
      .then(user => {
        // const newHand = user.hands
        console.log(user)
      })
    //  .then(user => User.findByIdAndUpdate(user._id, { cards: '1' }))
      .then(hands => console.log(hands))
      .catch(error => console.log(error))
  }
}

module.exports = {
  createUsersHand,
  updateUsersCards
}
