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
      ref: 'User',
      required: true
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Table', tableSchema)
