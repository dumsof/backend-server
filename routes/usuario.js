var express = require('express');
var app = new express();

var Usuario = require('../models/usuario');


app.get("/", (request, respuesta, next) => {

    Usuario.find({}, (error, usuarios) => {

        if (error) {
            return respuesta.status(500).json({
                ok: false,
                mensaje: "Error cargando usuario base de datos",
                errors: error
            });
        }

        respuesta.status(200).json({
            ok: true,
            usuarios: usuarios
        });

    });

});

module.exports = app;