const User = require('./../app/models/user')
// const ObjectId = require('mongodb').ObjectID

const createUsersHand = function (data, id) {
  console.log(data.owner)
  console.log('running')
  User.findByIdAndUpdate(data.owner, { $addToSet: { hand: data } }, { new: true, useFindAndModify: false })
    .then(hand => console.log(hand))
    .catch(error => console.log(error))
}

module.exports = {
  createUsersHand
}
