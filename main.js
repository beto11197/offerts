var express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser());
app.use(express.static("public"));
   
var swig = require("swig"); 

var MongoClient = require("mongodb").MongoClient;

app.listen(8080, function(){
    console.log("Servidor listo");
});
   
function Producto(nombre,precio,lugar,url){
    this.nombre = nombre;
    this.precio = precio;
    this.lugar = lugar;
    this.url = url;
}
   
app.get('/productos',function(req,res){
    MongoClient.connect("mongodb://localhost:27017/producto", function(err,db){
        var dbo = db.db("ciberweek");
        var collection = dbo.collection("producto");
  
        collection.find({}).toArray(function(err,producto){
            db.close(); 
            console.log(producto) 
            var respuesta = swig.renderFile("public/productos.html",{productos:producto})
            res.send(respuesta);
        });
    });
});

app.post('/producto/insertar',function(req,res){
    MongoClient.connect("mongodb://localhost:27017/producto", function(err,db){
        var dbo = db.db("ciberweek");
        var collection = dbo.collection("producto");
        var newProducto = new Producto(req.body.nombre,req.body.precio,req.body.lugar,req.body.url);
 
        collection.insertOne(newProducto,function(err,result){
            if (err) { 
                res.send(err);
            }else{
                res.send("Producto insertado");
            }
            db.close();
        })
    });
});

app.post('/producto/modificar/:id',function(req,res){
    MongoClient.connect("mongodb://localhost:27017/producto", function(err,db){
        var dbo = db.db("ciberweek");
        var collection = dbo.collection("producto");
        var newProducto = new Producto(req.body.nombre,req.body.precio,req.body.lugar,req.body.url);
 
        var ObjectID = require("mongodb").ObjectId;
        var id = new ObjectID(req.params.id);
 
        collection.updateOne({_id:id},{$set:newProducto},function(err,result){
            if (err) { 
                res.send("Error al modificar");
            }else{
                res.send("Producto modificado");
            }
            db.close();
        })
    });
});                 
    
app.get('/producto/eliminar/:id',function(req,res){
    MongoClient.connect("mongodb://localhost:27017/producto", function(err,db){
        var dbo = db.db("ciberweek");
        var collection = dbo.collection("producto");
 
        var ObjectID = require("mongodb").ObjectId;
        var id = new ObjectID(req.params.id);

        collection.remove({_id:id},function(err,result){
            if (err) { 
                res.send("Error al eliminar");
            }else{
                res.send("Producto Eliminado");
            }
            db.close();
        })  
    });
});

// app.get('/tareas',function(req,res){
//     res.send('Petición al servicio de tareas')
// });

// app.get('/anuncio/:id', function(req,res){
//     res.send("Estas consultando la información del anuncio" + req.params.id);
// });