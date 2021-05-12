const mongoose = require('mongoose')

var newTagsSchema = new mongoose.Schema({
  number: { type: String },
  newTag: { type: String },
  group: { type: String },
  date: { type: String },
})

module.exports = mongoose.model('newTagsSchema', newTagsSchema)
