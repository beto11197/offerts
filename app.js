const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Users = require("./api/users");
var MongoClient = require("mongodb").MongoClient;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/users', Users);

mongoose.connect(
    "mongodb://localhost/usuarios",
    { useNewUrlParser: true },
    (err, res) => {
        err && console.log("Error conectando a la bd");
        app.listen(3000, () => {
            console.log("nodejs app running...")
        })
    }
)

function Post(titulo,descripcion,texto){
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.texto = texto;
}

app.get("/api/posts", verifyToken, (req, res) => {
    jwt.verify(req.token, 'tokenKeySecret', (error, authData) => {
        if (error) {
            res.sendStatus(403);
        } else {
            MongoClient.connect("mongodb://localhost:27017/posts", function (err, db) {
                var dbo = db.db("posts");
                var collection = dbo.collection("posts");

                collection.find({}).toArray(function (err, post) {
                    res.status(200).json({post});
                });
            });
        }
    })
})

app.post('/api/posts',function(req,res){
    MongoClient.connect("mongodb://localhost:27017/posts", function(err,db){
        var dbo = db.db("posts");
        var collection = dbo.collection("posts");
        var newProducto = new Post(req.body.titulo,req.body.descripcion,req.body.texto);
 
        collection.insertOne(newProducto,function(err,result){
            if (err) { 
                res.status(500).send(err);
            }else{
                res.status(200).json({mensaje:"Post insertado correctamente"});
            }
            db.close();
        })
    });
});

app.put('/api/posts/:id',function(req,res){
    MongoClient.connect("mongodb://localhost:27017/posts", function(err,db){
        var dbo = db.db("posts");
        var collection = dbo.collection("posts");
        var newProducto = new Post(req.body.titulo,req.body.descripcion,req.body.texto);
 
        var ObjectID = require("mongodb").ObjectId;
        var id = new ObjectID(req.params.id);

        collection.updateOne({_id:id},{$set:newProducto},function(err,result){
            if (err) { 
                res.status(500).send(err);
            }else{
                res.status(200).json({mensaje:"Post modificado correctamente"});
            }
            db.close();
        })
    });
});

app.get('/api/posts/:id',function(req,res){
    MongoClient.connect("mongodb://localhost:27017/posts", function(err,db){
        var dbo = db.db("posts");
        var collection = dbo.collection("posts");
 
        var ObjectID = require("mongodb").ObjectId;
        var id = new ObjectID(req.params.id);

        collection.remove({_id:id},function(err,result){
            if (err) { 
                res.send("Error al eliminar el post");
            }else{
                res.send("Post Eliminado");
            }
            db.close();
        })  
    });
});



function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

