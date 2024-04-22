const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');

var juiz = new Schema({
    username: {
        type:String
    },
    password: {
        type:String
    }
})

juiz.plugin(passportLocalMongoose);

module.exports = mongoose.model('juiz', juiz,'juiz')