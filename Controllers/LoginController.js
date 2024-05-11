const asyncHandler = require('express-async-handler');
const bcrpyt = require('bcrypt');
const jwt = require('jsonwebtoken');
const juiz = require('../models/juizModel');


//@desc Login Juiz
//@route POST /api/users/login
//@acess public
const loginUser = asyncHandler(async(req,res) => {
    const{username, password} = req.body;
    if(!username || !password) {
        res.status(400)
        throw new Error ("Todos os campos são obrigatórios");
    }
    const user = await juiz.findOne({ username });
    if(user && (await bcrpyt.compare(password. user.password))) {
        const acessToken = jwt.sign({
            user:{
                username: user.username,
                id: user.id,
            },
        }, process.env.ACESS_TOKEN_SECRET, {expiresIn: "1m"})
        res.status(200).json({ acessToken })
    }
    else{
        res.status(401)
        throw new Error("Usuário ou senha incorreta");
    }
});

module.exports = {loginUser};