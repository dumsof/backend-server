var express = require('express');
var app = new express();


app.get("/", (request, respuesta, next) => {
    respuesta.status(200).json({
        ok: true,
        mensaje: "Petición realizada correctamente.",
    });
});

module.exports = app;