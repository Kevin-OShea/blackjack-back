const mongoose = require('mongoose')

const handSchema = new mongoose.Schema({
  cards: {
    type: String,
    required: true
  },
  current_bet: {
    type: Number,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner_name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Hand', handSchema)
