
const express = require('express');
const path = require('path');
const routes = require('./routes/routes');
const BodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const ejs = require('ejs');
const mongoose = require('mongoose');
const Juiz = require("./models/juizModel");
const paises = require('./models/PaisModel');
const atletas = require('./models/AtletaModel');
const dotenv = require('dotenv').config();

const app = express();

// Porta / API

const url = "http://teste-olimpiadas-iesb.sa-east-1.elasticbeanstalk.com/";
const port = 3000;

// View engine setup

app.use(BodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// DB Connection

try{
    mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Banco Conectado!");
}catch(e){
    res.status(400).json({e});
}

// Configuração app

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(routes);

app.get('/api/atletas', async (req, res) => {
    const query = atletas.find();
    const docs = await query;
    res.json(docs);
});

app.listen(port, () =>{
    console.log(`Server Running`);
    console.log(`Access in: http://localhost:${port} `);
}
)