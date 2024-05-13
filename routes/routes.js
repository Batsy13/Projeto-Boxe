const express = require('express');
const route = express.Router();
const juiz = require("../models/juizModel");
const atleta = require("../models/AtletaModel");
const partida = require("../models/PartidaModel");
const mongoose = require("mongoose");
const urlteste = 'http://teste-olimpiadas-iesb.sa-east-1.elasticbeanstalk.com/';
const axios = require("axios");
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware

const validateToken = asyncHandler(async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          res.status(401);
          throw new Error("User is not authorized");
        }
        req.user = decoded.user;
        next();
      });
    } else {
      res.status(401);
      throw new Error("User is not authorized or token is missing");
    }
  } catch (error) {
    next(error);
  }
});
// Controllers

const homeController = require("../Controllers/HomeController");

// Var Global Token

let authToken = '';
axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

// Rotas da Home
route.get('/', homeController.paginaInicial);
route.get('/login', homeController.logininit);

// // Rotas do Login

route.post('/login', async(req,res) =>{
  const{username, password} = req.body;
  if(!username || !password) {
      res.status(400)
      res.send("<script>  window.alert('Erro: Todos os campos são obrigatórios'); window.location.href = '/login'</script>")
  }
  const user = await juiz.findOne({ username });
  if(user && (password === user.password)) {
      const acessToken = jwt.sign({
          user:{
              username: user.username,
          },
      }, 
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: "20m"}
  );
      console.log(acessToken)
      res.render("menu");
  }else{
      res.status(401)
      res.send("<script>  window.alert('Erro: Usuário ou senha incorreta'); window.location.href = '/login'</script>")
  }
})

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

// Rotas Menu - Secretas

route.get("/menu",validateToken, (req, res) => {
  res.render("menu");
})

route.get("/Atleta", (req,res) => {
  res.render("Atleta");
});

route.get("/Partida", (req,res) => {
  res.render("Partida");
});

route.get("/Dados",(req,res) => {
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