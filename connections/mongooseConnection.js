const mongoose = require('mongoose')
require('dotenv').config()

module.exports = mongoConnection = async () => {
  try {
    const db = await mongoose.connect(`${process.env.MONGODBCONN}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    console.log('Conectado ao MongoDB')
    return db
  } catch (err) {
    if (err) throw err
  }
}
