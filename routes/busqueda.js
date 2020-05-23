var express = require('express');

var app = new express();

var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

/* Busqueda por colección */
app.get("/coleccion/:tabla/:busqueda", (request, respuesta, next) => {
    var busqueda = request.params.busqueda;
    var tabla = request.params.tabla;
    var busquedaRegex = new RegExp(busqueda, 'i');

    var promesa;
    switch (tabla) {
        case 'hospitales':
            promesa = buscarHospitales(busqueda, busquedaRegex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, busquedaRegex);
            break;
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, busquedaRegex);
            break;
        default:
            return respuesta.status(400).json({
                Ok: false,
                message: 'Los tipos de busqueda solo son usuarios, medicos, hospitales',
                errors: { menssage: 'Tipo de tabla/coleccion no válida' }
            });
    }

    promesa.then(dato => {
        respuesta.status(400).json({
            Ok: false,
            [tabla]: dato
        });
    });
});

app.get("/todo/:busqueda", (request, respuesta, next) => {
    var busqueda = request.params.busqueda;
    /* expresion regular para que tenga en cuenta minusculas o mayuscula el dato a buscar */
    var busquedaRegex = new RegExp(busqueda, 'i');

    /* Esto permite ejecutar todas las promesas al tiempo y obtener todas las respuestas
       las respustas se devuelven segun la posicion del vector */
    Promise.all([
            buscarHospitales(busqueda, busquedaRegex),
            buscarMedicos(busqueda, busquedaRegex),
            buscarUsuarios(busqueda, busquedaRegex)
        ])
        .then(respuestasBusquedas => {
            respuesta.status(200).json({
                hospitales: respuestasBusquedas[0],
                medicos: respuestasBusquedas[1],
                usuarios: respuestasBusquedas[2]
            });
        });



});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((error, hospitales) => {
                if (error) {
                    reject('Error al cargar hospitales', error);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((error, medicos) => {
                if (error) {
                    reject('Error al cargar hospitales', error);
                } else {
                    resolve(medicos);
                }
            });
    });
}

/* buscar por el nombre y el mail */
function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((error, usuarios) => {
                if (error) {
                    reject('Error al cargar usuarios', error);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;