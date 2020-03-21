// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for tables
const Table = require('../models/table')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { table: { title: '', text: 'foo' } } -> { table: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

const user = require('../../lib/userOutRoute')

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /tables
router.get('/tables/gameId', (req, res, next) => {
  Table.find()
    // respond with status 200 and JSON of the tables
    .then(tables => res.status(200).json({ tables: tables }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// INDEX
// GET /tables
router.get('/tables', (req, res, next) => {
  Table.find()
    .then(tables => {
      // `tables` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return tables.map(table => table.toObject())
    })
    // respond with status 200 and JSON of the tables
    .then(tables => res.status(200).json({ tables: tables }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /tables/5a7db6c74d55bc51bdf39793
router.get('/tables/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Table.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "table" JSON
    .then(table => res.status(200).json({ table: table.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// INDEX
// GET /tables
router.post('/tables/users', requireToken, (req, res, next) => {
  console.log('/tables/users')
  console.log(req)
  Table.find()
    .then(players => {
      user.updateUsersCards(req.body, players)
    })
    // respond with status 200 and JSON of the tables
    .then(tables => res.status(200).json({ tables: tables }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /tables
router.post('/tables', requireToken, (req, res, next) => {
  console.log('/tables')
  console.log(req.hand_id)
  // set owner of new table to be current user
  req.body.table.owner = req.user.id

  Table.create(req.body.table)
    // respond to succesful `create` with status 201 and JSON of new "table"
    .then(table => {
      res.status(201).json({ table: table.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

router.patch('/tables/join/:id', requireToken, removeBlanks, (req, res, next) => {
  Table.findByIdAndUpdate(req.params.id, { $addToSet: { players: req.user.id } }, { new: true, useFindAndModify: false })
    .then(handle404)
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

router.patch('/tables/leave/:id', requireToken, removeBlanks, (req, res, next) => {
  Table.findByIdAndUpdate(req.params.id, { $pull: { players: req.user.id } }, { new: true, useFindAndModify: false })
    .then(handle404)
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// UPDATE
// PATCH /tables/5a7db6c74d55bc51bdf39793
router.patch('/tables/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.table.owner

  Table.findById(req.params.id)
    .then(handle404)
    .then(table => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, table)

      // pass the result of Mongoose's `.update` to the next `.then`
      return table.updateOne(req.body.table)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /tables/5a7db6c74d55bc51bdf39793
router.delete('/tables/all', requireToken, (req, res, next) => {
  Table.remove()
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /tables/5a7db6c74d55bc51bdf39793
router.delete('/tables/:id', requireToken, (req, res, next) => {
  Table.findById(req.params.id)
    .then(handle404)
    .then(table => {
      // throw an error if current user doesn't own `table`
      requireOwnership(req, table)
      // delete the table ONLY IF the above didn't throw
      table.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
