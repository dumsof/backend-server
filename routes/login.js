var express = require("express");
var bcrypt = require("bcrypt");
var app = new express();

/* MedlleWare */
/* Esto permite que pueda leer en el post json */
app.use(express.json());
/* Dum: funcion para ver la ruta solicitada */
app.use(logger);

var Usuario = require("../models/usuario");

/* Dum: Login */

app.post('/', (req, respuesta) => {

    var body = req.body;
    Usuario.findOne({ email: body.email }, (error, usuarioBaseDato) => {

        if (error) {
            return respuesta.status(500).json({
                ok: false,
                mensaje: "Error al buscar el usuario",
                errors: error,
            });
        }

        if (!usuarioBaseDato || !bcrypt.compareSync(body.password, usuarioBaseDato.password)) {
            return respuesta.status(400).json({
                ok: false,
                mensaje: "El usuario o el password son incorrectos, por favor verifique.",
                errors: error,
            });
        }

        /* DUM: se debe crear un token */

        respuesta.status(200).json({
            ok: true,
            body: usuarioBaseDato,
            id: usuarioBaseDato.id
        });

    });


});


/* Dum: Poder ver ruta solicitada, registrar peticiones que llegan al servidor
MidleWare siempre se ejecuta antes de cualquier petición */
function logger(req, res, next) {
    console.log(
        `Ruta Recibida :  ${req.protocol}://${req.get("host")}${req.originalUrl}`
    );
    next();
}

module.exports = app;