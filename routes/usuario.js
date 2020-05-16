var express = require("express");
var bcrypt = require('bcrypt');
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
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((errores, usuarioGuardado) => {
        if (errores) {
            return respuesta.status(400).json({
                ok: false,
                mensaje: "Error al crear usuario en la base de datos",
                errors: errores,
            });
        }
        res.status(201).json({
            ok: true,
            body: usuarioGuardado,
        });
    });
});

/* Actualizar usuario */
app.put("/:id", (req, res) => {
    /* solo funciona con la libreria body parse */
    var id = req.params.id;
    Usuario.findById(id, (error, usuario) => {
        if (errores) {
            return respuesta.status(500).json({
                ok: false,
                mensaje: "Error Base de Datos, Buscar usuario Actualizar",
                errors: errores,
            });
        }
        if (!usuario) {
            return respuesta.status(400).json({
                ok: false,
                mensaje: "El usuario no existe",
                errors: { message: 'No existe un usuario con ese ID' },
            });
        }
        var body = req.body;

        usuario.nombre = body.nombre;
        usuario.apellidos = body.apellidos;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((errores, usuarioGuardado) => {
            if (errores) {
                return respuesta.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar usuario",
                    errors: errores,
                });
            }
            res.status(201).json({
                ok: true,
                body: usuarioGuardado,
            });
        });

    });
});

module.exports = app;