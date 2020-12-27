const mongoose = require('mongoose')

const serverSchema = mongoose.Schema({
  id: String,
  adminRole: String,
  prefix: String
})

const Server = mongoose.model('Server', serverSchema)

module.exports = Server