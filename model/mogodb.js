var mongoose = require('mongoose')
var properties = require('../properties.js')

mongoose.Promise = require('bluebird')
mongoose.connect(properties.mongo_url)

module.exports = mongoose