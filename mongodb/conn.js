const mongoose = require('mongoose');


async function main(){
    
    try {
        await mongoose.connect("mongodb+srv://pedro:boxe@boxe1.d4ucnkt.mongodb.net/?retryWrites=true&w=majority&appName=Boxe1");
        console.log("Banco conectado!");
    }
    catch (error){
        console.log(`Error: ${error}`);
    }
}

module.exports = main;