const User = require('./../app/models/user')
const ObjectId = require('mongodb').ObjectID


module.exports = function (data, req, res, next) {
  // console.log(data)
  // console.log(req)

 // console.log(res)
  // const handArray = res.update
  const playerArray = req[0].players
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
  // next()
}
