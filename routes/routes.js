const express = require('express');
const route = express.Router();
const juiz = require("../models/juizModel");
const atleta = require("../models/AtletaModel");
const partida = require("../models/PartidaModel");
const mongoose = require("mongoose");
const url = 'https://olimpiadasiesb-7780607c931d.herokuapp.com/';
const idboxe = "6601ece87d406070201176ae";
const axios = require("axios");
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware

const validateToken = asyncHandler(async (req, res, next) => {

    const token = req.cookies.jwt ;

    if(token){
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decodedToken) => {
        if(error){
          console.log(error.message);
          res.redirect('/login')
        }else{
          console.log(decodedToken);
          next();
        }
      })
    }
    else{
      res.redirect('/login')
    }

});
// Controllers

const homeController = require("../Controllers/HomeController");

// Var Global Token

let authToken = '';
let acessToken = '';
axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

// Rotas da Home
route.get('/', homeController.paginaInicial);
route.get('/login', homeController.logininit);
route.get('/chaveamento', homeController.chave);

// // Rotas do Login

route.post('/login', async(req,res) =>{
  const{username, password} = req.body;
  if(!username || !password) {
      res.status(400)
      res.send("<script>  window.alert('Erro: Todos os campos são obrigatórios'); window.location.href = '/login'</script>")
  }
  const user = await juiz.findOne({ username });
  if(user && (password === user.password)) {
      acessToken = jwt.sign({
          user:{
              username: user.username,
              id: user.id,
          },
      }, 
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: "20m"}
  );
      console.log(acessToken)
      authToken = await LoginApi(user.username, user.password);
      res.cookie('jwt', acessToken, {httpOnly: true})
      console.log(authToken);
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
    let response = await axios.post(`${url}login/token`, log, {Headers: {'content-type': 'x-www-form-urlencoded',}});
    return response.data.token;
  } catch (error) {
    return error;
  }
}

// Rotas Menu - Secretas

route.get("/menu",validateToken, (req, res) => {
  res.render("menu");
})

route.get("/Atleta",validateToken, (req,res) => {
  res.render("Atleta");
});

route.get("/Partida", validateToken,(req,res) => {
  res.render("Partida");
});

route.get("/Dados", validateToken ,(req,res) => {
  res.render("Dados");
});

route.get("/Agendar", validateToken ,(req,res) => {
  res.render("Agendar");
})

// Rotas forms

route.post("/Atleta", async (req,res) => {

  const atlet = await atleta.create({
    country: req.body.pais,
    weight_category: req.body.peso,
    athlete: req.body.atleta,
    age: req.body.idade,
    gender: req.body.genero,
  })
  res.send("<script>  window.alert('Atleta Adicionado Com sucesso'); window.location.href = '/Atleta'</script>");
  
});

route.patch("/Partida", async (req,res) => {
  const { id_categoria, id_partida, categoria, atleta1, atleta2, ponto1, ponto2, falta1, falta2 } = req.body;
  try {
    const part = await partida.findOneAndUpdate(
      { id_categoria: id_categoria, id_partida: id_partida }, 
      { id_atleta: atleta1, id_atleta2: atleta2, ponto1, ponto2, falta1, falta2 }, 
      { new: true } 
    );
    if (!part) {
      return res.status(404).json({ message: 'Partida não encontrada' });
    }
    const partidaData = {id_partida, categoria, atleta1, atleta2, ponto1, ponto2, falta1, falta2};
    await axios.patch(`${url}esportes/${idboxe}/partidas`, partidaData );
    return res.status(200).json(part);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Erro ao atualizar a partida' });
  }
});


route.post("/Agendar", async(req,res) => {
  let data1 = new Date(req.body.date1);
  let dia = toISOStringWithTimezone(data1);

  const partidaExistente = await partida.findOne({
    id_categoria: req.body.categoria,
    id_partida: req.body.id_partida,
  })
  
  if( partidaExistente ){
    return res.send("<script>  window.alert('Erro: Partida já cadastrada '); window.location.href = '/Agendar'</script>");
  }

  const agendar = await partida.create({
    id_categoria: req.body.categoria,
    id_partida: req.body.partida,
    id_atleta: null,
    id_atleta2: null,
    ponto1: null,
    ponto2: null,
    falta1: null,
    falta2: null,
    date: dia,
    local: req.body.local,
  })

  try{
    const agendarapi = {
      data: dia,
      local: req.body.local,
      fase: req.body.partida,
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
    await axios.post(`${url}esportes/${idboxe}/partidas`, agendarapi);
  }
  catch (error){
    console.log(error);
  }
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

// Api

route.get('/api/paises',async (req, res) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  await axios.get(`${url}paises`)
  .then((response) => {
    res.json(response.data); // Envia os dados da resposta como JSON
  })
  .catch((e) => {
    console.log(e);
    res.status(500).send('Erro ao buscar países'); // Envia uma mensagem de erro se a solicitação falhar
  });
});

// Funções

function toISOStringWithTimezone(date) {
  var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function(num) {
          var norm = Math.floor(Math.abs(num));
          return (norm < 10 ? '0' : '') + norm;
      };
  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      dif + pad(tzo / 60) +
      ':' + pad(tzo % 60);
}

module.exports = route;