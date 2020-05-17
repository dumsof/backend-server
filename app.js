/* Requieres */
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

/* Inicializar variables */
var app = express();

//Body parser es un milleware para utilizar objeto de java scrip en cualquier lugar.
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Importar rutas
var appRoutas = require("./routes/app");
var usuarioRoutas = require("./routes/usuario");
var hospitalRoutas = require("./routes/hospital");
var loginRoutas = require("./routes/login");

mongoose.connection.openUri(
    "mongodb://localhost:27017/hospital-db",
    (error, respuesta) => {
        if (error) {
            throw error;
        }
        console.log("Base de datos: \x1b[32m%s\x1b[0m", " online");
    }
);

//Rutas
app.use("/usuario", usuarioRoutas);
app.use("/login", loginRoutas);
app.use("/hospital", hospitalRoutas);
app.use("/", appRoutas);

/* DUM: servidor corre en el puerto 3000, comando node app, los caracteres es para dar color a online */
app.listen(3000, () => {
    console.log("Express server puerto 3000: \x1b[32m%s\x1b[0m", " online");
});