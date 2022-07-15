const res = require("express/lib/response");
const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


const login = (req,res) =>{
    User.findOne({username: req.body.username}, (err,user) => {
        console.log(user)
        err && res.status(500).send(err.message);
        if (user.password === req.body.password) {
            console.log("si son");
            jwt.sign({user:user}, 'tokenKeySecret', {expiresIn:'1h'}, (err, token) =>{
                res.status(200).json({usuario:user.username, nombre:user.name,token});
            })
        }else{
            res.status(403).json({mensaje:"Datos no validos"});
        }
    })
}

const addUser = (req, res) => {
    let user = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    });

    user.save((err, usr) => {
        err && res.status(500).send(err.message);
        res.status(200).json(usr);
    });
} 


module.exports = { login, addUser };