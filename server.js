
const express = require('express');
const path = require('path');
const routes = require('./routes');
LocalStrategy = require("passport-local");
BodyParser = require("body-parser");
passport = require("passport");
const ejs = require('ejs');
const mongoose = require('mongoose');
passportLocalMongoose = require("passport-local-mongoose");
const Juiz = require("./models/juizModel");

const app = express();

// Porta / API

const url = "http://teste-olimpiadas-iesb.sa-east-1.elasticbeanstalk.com/";
const port = 3000;

// View engine setup

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// Inicializadores do express session / senha

app.use(require("express-session")({
    secret: "projetinho bacana legal",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Juiz.authenticate()));
passport.serializeUser(Juiz.serializeUser());
passport.deserializeUser(Juiz.deserializeUser());

// DB Connection

try{
    mongoose.connect("mongodb+srv://pedro:boxe1234@boxe1.d4ucnkt.mongodb.net/boxe1?retryWrites=true&w=majority&appName=Boxe1");
    console.log("Banco Conectado!");
}catch(e){
    res.status(400).json({e});
}

// Configuração app

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(routes);

app.listen(port, () =>{
    console.log(`Server Running`);
    console.log(`Access in: http://localhost:${port} `);
}
)