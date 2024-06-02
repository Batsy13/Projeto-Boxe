const mongoose = require('mongoose')
const Schema = mongoose.Schema

var partida = new Schema({
    id_partida_api: {
        type:String,
    },
    id_categoria: {
        type: String,
    },
    id_partida: {
        type: String,
    },
    id_atleta: {
        type:String,
    },
    nome_atleta: {
        type:String,
    },
    id_atleta2: {
        type:String,
    },
    nome_atleta2: {
        type:String,
    },
    ponto1: {
        type:String,
    },
    ponto2: {
        type:String,
    },
    falta1: {
        type:String,
    },
    falta2: {
        type:String,
    },
    date: {
        type:Date,
    },
    id_vencedor: {
        type:String,
    },
    id_perdedor: {
        type:String,
    },
    local: {
        type:String
    },
    fase: {
        type:String
    },

})

module.exports = mongoose.model('partidas', partida,'partidas')