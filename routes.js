const express = require('express');
const route = express.Router();
const juiz = require("./models/juizModel");
const atleta = require("./models/AtletaModel");
const partida = require("./models/PartidaModel");
const mongoose = require("mongoose");
const urlteste = 'http://teste-olimpiadas-iesb.sa-east-1.elasticbeanstalk.com/';
const axios = require("axios");

// Controllers
const homeController = require("./Controllers/HomeController");
const loginController = require("./Controllers/LoginController");

// Var Global Token

let authToken = '';
axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

// Rotas da Home
route.get('/', homeController.paginaInicial);
route.get('/login', homeController.logininit);

// // Rotas do Login

// route.post("/login", async (req, res) => {
//     const user = await juiz.create({
//       username: req.body.username,
//       password: req.body.password
//     });

//     return res.status(200).json(user);
//   });

route.post("/login", loginController.loginUser);

async function LoginApi(username, password){
  const log = new URLSearchParams({
    username: username,
    password: password,
  })
  try {
    let response = await axios.post(`${urlteste}login/token`, log, {Headers: {'content-type': 'x-www-form-urlencoded',}});
    return response.data.token;
  } catch (error) {
    return null;
  }
}

// Rotas Menu

route.get("/menu",(req, res) => {
  res.render("menu");
})

route.get("/Atleta", (req,res) => {
  res.render("Atleta");
});

route.get("/Partida", (req,res) => {
  res.render("Partida");
});

route.get("/Dados", (req,res) => {
  res.render("Dados");
});

// Rotas Atleta

route.post("/Atleta", async (req,res) => {

  const atlet = await atleta.create({
    country: req.body.pais,
    weight_category: req.body.peso,
    athlete: req.body.atleta,
    age: req.body.idade,
  })
  res.send("<script>  window.alert('Atleta Adicionado Com sucesso'); window.location.href = '/Atleta'</script>");
  
});

route.post("/Partida", async (req,res) => {
  const part = await partida.create({
    id_atleta: req.body.atleta1,
    id_atleta2: req.body.atleta2,
    ponto1: req.body.ponto1,
    ponto2: req.body.ponto2,
    falta1: req.body.falta1,
    falta2: req.body.falta2,
    date: req.body.date1,
    local: req.body.local,
  })
  return res.status(200).json(part);
})

// Rotas Dados

route.get('/atletas', async (req, res) => {
  const atletas = await atleta.find().sort('nome');
  res.json(atletas);
});

route.put('/atletas/:id', async (req, res) => {
  const atletas = await atleta.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(atletas);
});

route.delete('/atletas/:id', async (req, res) => {
  await atleta.findByIdAndDelete(req.params.id);
  res.json({ message: 'Atleta excluído' });
});


module.exports = route;