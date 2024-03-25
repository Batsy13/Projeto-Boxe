const express = require('express');
const app = express();
const fs = require('fs').promises;
const mongoose = require('mongoose');

const mongoose = mongoose.connect(''); // Linkar banco de dados
const port = 3000;

app.listen(port, () =>{
    console.log(`Server Running`);
    console.log(`Access in: http://localhost:${port} `);
}
)