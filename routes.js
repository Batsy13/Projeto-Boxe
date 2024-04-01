const express = require('express');
const route = express.Router();
const homeController = require("./Controllers/HomeController");

// Rotas da Home
route.get('/', homeController.paginaInicial);


module.exports = route;