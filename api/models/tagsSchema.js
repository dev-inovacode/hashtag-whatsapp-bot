const mongoose = require('mongoose')
const moment = require('moment')

moment.locale('pt-br')

const hour = moment().format('LT')
const date = moment().format('L')

var tagsSchema = new mongoose.Schema({
  tags: { type: String },
  addedOn: { type: String, default: `${date} ${hour}` },
})

module.exports = mongoose.model('tagsSchema', tagsSchema)
