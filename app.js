/* Requieres */
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

/* Inicializar variables */
var app = express();

/* CORS */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

//Body parser es un milleware para utilizar objeto de java scrip en cualquier lugar.
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Importar rutas
var appRoutas = require("./routes/app");
var usuarioRoutas = require("./routes/usuario");
var hospitalRoutas = require("./routes/hospital");
var medicoRoutas = require("./routes/medico");
var busquedaRoutas = require("./routes/busqueda");
var uploadRoutas = require("./routes/upload");
var loginRoutas = require("./routes/login");
var imagenesRoutas = require("./routes/imagenes");
mongoose.connection.openUri(
    "mongodb://localhost:27017/hospital-db",
    (error, respuesta) => {
        if (error) {
            throw error;
        }
        console.log("Base de datos: \x1b[32m%s\x1b[0m", " online");
    }
);
//Server index config
//esta libreria se instala con el comando npm install --save serve-index
//esto permite mostar en el explorador las carpetas e imagenes
//http://localhos:3000/uploads/
/* var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'));
app.use('/uploads', serveIndex(__dirname + '/uploads')); */

//Rutas
app.use("/usuario", usuarioRoutas);
app.use("/login", loginRoutas);
app.use("/hospital", hospitalRoutas);
app.use("/medico", medicoRoutas);
app.use("/busqueda", busquedaRoutas);
app.use("/upload", uploadRoutas);
app.use("/img", imagenesRoutas);
app.use("/", appRoutas);

/* DUM: servidor corre en el puerto 3000, comando node app, los caracteres es para dar color a online */
app.listen(3000, () => {
    console.log("Express server puerto 3000: \x1b[32m%s\x1b[0m", " online");
});