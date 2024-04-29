const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Atleta = new Schema({
    country: String,
    weight_category: Number,
    athlete: String,
    age: Number,
})

module.exports = mongoose.model('atleta', Atleta,'atleta');