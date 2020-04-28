/* Requieres */
var express = require("express");
var mongoose = require("mongoose");

/* Inicializar variables */
var app = express();

mongoose.connection.openUri(
    "mongodb://localhost:27017/hospital-db",
    (error, respuesta) => {
        if (error) {
            throw error;
        }
        console.log("Base de datos: \x1b[32m%s\x1b[0m", " online");
    }
);

/* Rutas */
app.get("/", (request, respuesta, next) => {
    respuesta.status(200).json({
        ok: true,
        mensaje: "Petición realizada correctamente.",
    });
});

/* DUM: servidor corre en el puerto 3000, comando node app */
app.listen(3000, () => {
    console.log("Express server puerto 3000: \x1b[32m%s\x1b[0m", " online");
});