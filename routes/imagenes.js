var express = require('express');

var app = new express();

const path = require('path');
const fileSystem = require('fs');


app.get("/:tipo/:img", (request, respuesta, next) => {

    var tipo = request.params.tipo;
    var img = request.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fileSystem.existsSync(pathImagen)) {
        respuesta.sendFile(pathImagen);
    } else {
        var pathNoImagen = path.resolve(__dirname, `../assets/no-img.jpg`);
        respuesta.sendFile(pathNoImagen);
    }

});

module.exports = app;