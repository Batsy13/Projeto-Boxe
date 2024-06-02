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

  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decodedToken) => {
      if (error) {
        res.redirect('/login');
      } else {
        next();
      }
    })
  }
  else {
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

route.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send("<script>  window.alert('Erro: Todos os campos são obrigatórios'); window.location.href = '/login'</script>");
    return;
  }

  const user = await juiz.findOne({ username });
  if (user && (password === user.password)) {
    const accessToken = jwt.sign({
      user: {
        username: user.username,
        id: user.id,
      },
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60m" });

    authToken = await LoginApi(user.username, user.password);

    setInterval(async () => {
      authToken = await LoginApi(username, password);
    }, 4 * 60 * 1000); // verifica a cada minuto

    res.cookie('jwt', accessToken, { httpOnly: true });
    res.render("menu");
  } else {
    res.status(401).send("<script>  window.alert('Erro: Usuário ou senha incorreta'); window.location.href = '/login'</script>");
  }
});

async function LoginApi(username, password) {
  const log = new URLSearchParams({
    username: username,
    password: password,
  });
  try {
    let response = await axios.post(`${url}login/token`, log, { headers: { 'content-type': 'application/x-www-form-urlencoded' } });
    return response.data.token;
  } catch (error) {
    console.error("Erro ao obter o token da API externa:", error);
    return null;
  }
}
// Rotas Menu - Secretas

route.get("/menu", validateToken, (req, res) => {
  res.render("menu");
})

route.get("/Atleta", validateToken, (req, res) => {
  res.render("Atleta");
});

route.get("/Partida", validateToken, (req, res) => {
  res.render("Partida");
});

route.get("/Dados", validateToken, (req, res) => {
  res.render("Dados");
});

route.get("/Agendar", validateToken, (req, res) => {
  res.render("Agendar");
})

route.get("/DadosPartidas", validateToken, (req, res) => {
  res.render("DadosPartidas");
})

// Rotas forms

route.post("/Atleta", async (req, res) => {
  let categoria = "";
  const peso = req.body.peso;

  switch (true) {
    case peso >= 48 && peso <= 52:
      categoria = "Peso Mosca";
      break;
    case peso >= 53 && peso <= 57:
      categoria = "Peso Pena";
      break;
    case peso >= 58 && peso <= 63:
      categoria = "Peso Leve";
      break;
    case peso >= 64 && peso <= 69:
      categoria = "Meio-Médio";
      break;
    case peso >= 70 && peso <= 75:
      categoria = "Peso Médio";
      break;
    case peso >= 76 && peso <= 81:
      categoria = "Meio-Pesado";
      break;
    case peso >= 82 && peso <= 91:
      categoria = "Pesado";
      break;
    case peso > 91:
      categoria = "Super Pesado";
      break;
    default:
      categoria = "Peso não categorizado";
  }

  const paisid = req.body.country_id;

  try {
    const newAtleta = new atleta({
      id_api: "",
      country: paisid,
      weight: peso,
      weight_category: categoria,
      athlete: req.body.atleta,
      age: req.body.idade,
      gender: req.body.genero,
    });

    await newAtleta.save();

    const atletaData = {
      nome: req.body.atleta,
      idade: req.body.idade,
    };
    const json = JSON.stringify(atletaData);

    try {
      const response = await axios.post(`${url}atletas/${paisid}/${idboxe}`, json);
      const idApi = response.data._id;

      await atleta.findByIdAndUpdate(newAtleta._id, { id_api: idApi });
    } catch (error) {
      console.log(error);
    }

    return res.send("<script> window.alert('Atleta Adicionado Com sucesso'); window.location.href = '/Atleta'</script>");
  } catch (error) {
    console.log(error);
    return res.send("<script> window.alert('Houve um erro'); window.location.href = '/Atleta'</script>");
  }
});

route.patch("/Partida", async (req, res) => {
  const { categoria, partida1, atleta1, atleta2, ponto1, ponto2, falta1, falta2 } = req.body;

  try {
    const atleta1Data = await atleta.findOne({ athlete: atleta1 });
    const atleta2Data = await atleta.findOne({ athlete: atleta2 });

    if (!atleta1Data || !atleta2Data) {
      return res.status(404).json({ message: 'Atleta não encontrado' });
    }

    const id_atleta1_api = atleta1Data.id_api;
    const id_atleta2_api = atleta2Data.id_api;

    const id_pais_api1 = atleta1Data.country;
    const id_pais_api2 = atleta2Data.country;

    let id_ven_api = "";
    let id_perd_api = "";

    if (ponto1 > ponto2) {
      id_ven_api = id_pais_api1;
      id_perd_api = id_pais_api2;
    } else {
      id_ven_api = id_pais_api2;
      id_perd_api = id_pais_api1;
    }

    const part = await partida.findOneAndUpdate(
      { id_categoria: categoria, id_partida: partida1 },
      {
        nome_atleta: atleta1,
        id_atleta: id_atleta1_api,
        nome_atleta2: atleta2,
        id_atleta2: id_atleta2_api,
        ponto1: ponto1,
        ponto2: ponto2,
        falta1: falta1,
        falta2: falta2,
        id_vencedor: id_ven_api,
        id_perdedor: id_perd_api,
      },
      { new: true }
    );

    if (!part) {
      return res.status(404).json({ message: 'Partida não encontrada' });
    }

    const fasec = determinarFase(partida1);
    let partidaData = {
      detalhes: {
        vencedor_id: id_ven_api,
        perdedor_id: id_perd_api,
        pontuacao_atleta1: Number(ponto1),
        pontuacao_atleta2: Number(ponto2),
        faltas_atleta1: falta1,
        faltas_atleta2: falta2,
      }
    };

    if (fasec === 'final') {
      const semiFinalMatches = await partida.find({ id_categoria: categoria }).where('fase').equals('semis');

      let semiFinalLosers = semiFinalMatches.map(match => ({
        id: match.id_perdedor,
        pontos: match.ponto1 > match.ponto2 ? match.ponto2 : match.ponto1
      }));

      let bronzeMedalist = semiFinalLosers.reduce((prev, current) => (prev.pontos > current.pontos) ? prev : current).id;

      partidaData.resultado = {
        ouro: id_ven_api,
        prata: id_perd_api,
        bronze: bronzeMedalist
      };
    }

    const json = JSON.stringify(partidaData);

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      const response = await axios.patch(`${url}esportes/${idboxe}/partidas?_id=${part.id_partida_api}`, json);
    } catch (error) {
      console.log(error);
    }

    return res.status(200).json(part);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Erro ao atualizar a partida' });
  }
});

route.post("/Agendar", async (req, res) => {
  let data1 = new Date(req.body.date1);
  let dia = toISOStringWithTimezone(data1);

  let fasec = determinarFase(req.body.partida);

  try {
    // Buscar os IDs dos atletas
    const atleta1 = await atleta.findOne({ athlete: req.body.atleta1 });
    const atleta2 = await atleta.findOne({ athlete: req.body.atleta2 });

    if (!atleta1 || !atleta2) {
      return res.send("<script>  window.alert('Atleta não encontrado'); window.location.href = '/Agendar'</script>");
    }

    const existingPartida = await partida.findOne({
      id_partida: req.body.partida,
      id_categoria: req.body.categoria,
    });

    if (existingPartida) {
      await partida.updateOne(
        { _id: existingPartida._id },
        {
          $set: {
            date: dia,
            local: req.body.local,
          },
        }
      );
      return res.send("<script>  window.alert('Partida Atualizada Com Sucesso'); window.location.href = '/Agendar'</script>");
    } else {
      try {
        const agendarapi = {
          data: dia,
          local: req.body.local,
          fase: fasec,
          participantes: [
            atleta1.country,
            atleta2.country
          ]
        };

        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        const response = await axios.post(`${url}esportes/${idboxe}/partidas`, agendarapi);

        const idPartidaApi = response.data._id;

        await partida.create({
          id_partida_api: idPartidaApi,
          id_categoria: req.body.categoria,
          id_partida: req.body.partida,
          nome_atleta: req.body.atleta1,
          id_atleta: atleta1.id_api,
          nome_atleta2: req.body.atleta2,
          id_atleta2: atleta2.id_api,
          ponto1: "",
          ponto2: "",
          falta1: "",
          falta2: "",
          id_vencedor: "",
          id_perdedor: "",
          date: dia,
          local: req.body.local,
          fase: fasec,
        });

        return res.send("<script>  window.alert('Partida Agendada Com Sucesso'); window.location.href = '/Agendar'</script>");
      } catch (error) {
        console.log(error);
        return res.send("<script>  window.alert('Houve um Erro ao agendar a partida'); window.location.href = '/Agendar'</script>");
      }
    }
  } catch (error) {
    console.error(error);
    return res.send("<script>  window.alert('Houve um Erro'); window.location.href = '/Agendar'</script>");
  }
});

// Api

route.get('/api/atletas', async (req, res) => {
  const atletas = await atleta.find().sort('athlete');
  res.json(atletas);
});

route.put('/api/atletas/:id', async (req, res) => {
  const atletas = await atleta.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(atletas);
});

route.delete('/api/atletas/:id', async (req, res) => {
  await atleta.findByIdAndDelete(req.params.id);
  res.json({ message: 'Atleta excluído' });
});

route.get('/api/partidas', async (req, res) => {
  const atletas = await partida.find().sort('athlete');
  res.json(atletas);
});

route.put('/api/partidas/:id', async (req, res) => {
  const atletas = await partida.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(atletas);
});

route.delete('/api/partidas/:id', async (req, res) => {
  await partida.findByIdAndDelete(req.params.id);
  res.json({ message: 'Atleta excluído' });
});


route.get('/api/partida', async (req, res) => {
  const { categoria, partida1 } = req.query;

  try {
    const partidaEncontrada = await partida.findOne({ id_categoria: categoria, id_partida: partida1 });

    if (partidaEncontrada) {
      console.log(partidaEncontrada);
      res.json(partidaEncontrada);
    } else {
      res.status(404).send('Partida não encontrada');
    }
  } catch (error) {
    console.error('Erro ao buscar partida:', error);
    res.status(500).send('Erro no servidor');
  }
});


route.get('/api/paises', async (req, res) => {
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

route.get('/api/categoria/:categorias', async (req, res) => {
  try {
    const partidasArray = await partida.find({ id_categoria: req.params.categorias }).sort({ id_categoria: 1, id_partida: 1 }).exec();
    res.json(partidasArray);
  }
  catch (error) {
    console.log(error);
  }

})

// Funções

function toISOStringWithTimezone(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? '+' : '-',
    pad = function (num) {
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

function determinarFase(fasec) {
  let partida = fasec;
  let fase = '';

  if (partida >= 1 && partida <= 4) {
    fase = 'quartas';
  } else if (partida >= 5 && partida <= 6) {
    fase = 'semis';
  } else if (partida == 7) {
    fase = 'final';
  } else {
    fase = 'valor inválido';
  }

  return fase;
}

module.exports = route;