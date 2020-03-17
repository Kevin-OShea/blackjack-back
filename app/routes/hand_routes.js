// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for hands
const Hand = require('../models/hand')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { hand: { title: '', text: 'foo' } } -> { hand: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /hands
router.get('/hands', (req, res, next) => {
  Hand.find()
    .then(hands => {
      // `hands` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return hands.map(hand => hand.toObject())
    })
    // respond with status 200 and JSON of the hands
    .then(hands => res.status(200).json({ hands: hands }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /hands/5a7db6c74d55bc51bdf39793
router.get('/hands/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Hand.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "hand" JSON
    .then(hand => res.status(200).json({ hand: hand.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /hands
router.post('/hands', requireToken, (req, res, next) => {
  // set owner of new hand to be current user
  console.log(req.body)
  req.body.hand.owner = req.user.id

  Hand.create(req.body.hand)
    // respond to succesful `create` with status 201 and JSON of new "hand"
    .then(hand => {
      res.status(201).json({ hand: hand.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /hands/5a7db6c74d55bc51bdf39793
router.patch('/hands/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.hand.owner

  Hand.findById(req.params.id)
    .then(handle404)
    .then(hand => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, hand)

      // pass the result of Mongoose's `.update` to the next `.then`
      return hand.updateOne(req.body.hand)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /hands/5a7db6c74d55bc51bdf39793
router.delete('/hands/all', requireToken, (req, res, next) => {
  Hand.remove()
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /hands/5a7db6c74d55bc51bdf39793
router.delete('/hands/:id', requireToken, (req, res, next) => {
  Hand.findById(req.params.id)
    .then(handle404)
    .then(hand => {
      // throw an error if current user doesn't own `hand`
      requireOwnership(req, hand)
      // delete the hand ONLY IF the above didn't throw
      hand.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
