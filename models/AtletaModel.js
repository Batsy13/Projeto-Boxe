const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Atleta = new Schema({
    id_api: String,
    country: String,
    weight: Number,
    weight_category: String,
    athlete: String,
    age: Number,
    gender: String,
})

module.exports = mongoose.model('atleta', Atleta,'atleta');