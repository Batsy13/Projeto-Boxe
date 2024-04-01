const express = require('express');
const path = require('path');
const routes = require('./routes');

const app = express();

// Porta e API

const url = "http://teste-olimpiadas-iesb.sa-east-1.elasticbeanstalk.com/";
const port = 3000;


// View engine setup

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// DB Connection

const conn = require("./mongodb/conn");

conn();

// Configuração app

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

app.listen(port, () =>{
    console.log(`Server Running`);
    console.log(`Access in: http://localhost:${port} `);
}
)

// Rotas

app.use(routes);
