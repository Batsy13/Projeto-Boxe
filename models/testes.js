const mongoose = require('mongoose');

const { Schema } = mongoose;

const Atleta = new Schema({
    id_atleta: String,
    nome: String,
    idade: Number,
    peso: Number,
    id_pais: String,
})

const Partida = new Schema({
    id_partida: String,
    id_atleta1: String,
    id_atleta2: String,
    pontos1: Number,
    pontos2: Number,
    data: Date,
})

const Pais = new Schema({
    id_pais: String,
    nome: String,
    sigla: String,
})