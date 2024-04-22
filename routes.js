const express = require('express');
const route = express.Router();
const juiz = require("./models/juizModel");
const mongoose = require("mongoose");

// Controllers
const homeController = require("./Controllers/HomeController");
const loginController = require("./Controllers/LoginController");

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

route.post("/login", async function(req, res){
    try {
        // usuario existe?
        const user = await juiz.findOne({ username: req.body.username });
        if (user) {
          // verificador senha
          const result = req.body.password === user.password;
          if (result) {
            res.render("Atleta");
          } else {
            res.send("<script> window.alert('Senha Incorreta'); window.location.href = '/login'</script>");
          }
        } else {
          res.send("<script> window.alert('Usuario não encontrado'); window.location.href = '/login'</script>");
        }
      } catch (error) {
        res.status(400).json({ error: "Você é burro" });
      }
});

// Rotas Atleta

function Logado(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

route.get('/Atleta', Logado, function(req,res){
    res.render("Atleta");
});

// Rotas Menu

route.get("/menu", Logado, function(req,res){
  res.render("menu");
})

module.exports = route;