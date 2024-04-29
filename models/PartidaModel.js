const mongoose = require('mongoose')
const Schema = mongoose.Schema

var partida = new Schema({
    id_atleta: {
        type:String
    },
    id_atleta2: {
        type:String
    },
    ponto1: {
        type:Number
    },
    ponto2: {
        type:Number
    },
    falta1: {
        type:String
    },
    falta2: {
        type:String
    },
    date: {
        type:Date
    },
    local: {
        type:String
    },

})

module.exports = mongoose.model('partidas', partida,'partidas')