const mongoose = require('mongoose')

const tableSchema = new mongoose.Schema({
  cards: {
    type: String,
    required: true
  },
  total_bet: {
    type: Number,
    required: true
  },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  game_id: {
    type: Number,
    unique: true
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

module.exports = mongoose.model('Table', tableSchema)
