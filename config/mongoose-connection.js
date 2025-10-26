const mongoose = require('mongoose')
const config = require('config')
const dbgr = require('debug')('development:mongoose')

const mongoURI = process.env.MONGODB_URI || `${config.get('MONGODB_URI')}/scatchDb`

mongoose
  .connect(mongoURI)
  .then(() => {dbgr('connected')})
  .catch((err) => {dbgr(err)})

module.exports = mongoose.connection