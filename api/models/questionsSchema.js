const mongoose = require('mongoose')

var questionsSchema = new mongoose.Schema({
  number: { type: String },
  question: { type: String },
  answer: { type: String, default: '' },
  group: { type: String },
  date: { type: String },
  type: { type: String },
})

module.exports = mongoose.model('questionsSchema', questionsSchema)
