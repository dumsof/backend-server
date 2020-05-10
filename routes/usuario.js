var express = require("express");
var app = new express();

var Usuario = require("../models/usuario");

/* Obtener todos los usuarios */
app.get("/", (request, respuesta, next) => {
    /* DUM para que solo devuelva las columnas que se especifican excec */
    Usuario.find({}, "nombre apellidos email img role").exec(
        (error, usuarios) => {
            if (error) {
                return respuesta.status(500).json({
                    ok: false,
                    mensaje: "Error cargando usuario base de datos",
                    errors: error,
                });
            }

            respuesta.status(200).json({
                ok: true,
                usuarios: usuarios,
            });
        }
    );
});

/* Crear un nuevo usuario */
app.post("/", (req, res) => {
    /* solo funciona con la libreria body parse */
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });

    usuario.save((error, usuarioGuardado) => {
        if (error) {
            return respuesta.status(500).json({
                ok: false,
                mensaje: "Error al crear usuario en la base de datos",
                errors: error,
            });
        }
        res.status(201).json({
            ok: true,
            body: usuarioGuardado,
        });
    });
});

module.exports = app;