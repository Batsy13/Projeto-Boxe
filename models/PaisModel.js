const mongoose = require('mongoose')
const Schema = mongoose.Schema

var pais = new Schema({
    country: {
        type:String
    },
})


module.exports = mongoose.model('pais', pais,'pais')