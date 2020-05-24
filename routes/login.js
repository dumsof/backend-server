var express = require("express");
var bcrypt = require("bcrypt");
var jsonWebToken = require("jsonwebtoken");
var app = new express();

/* MedlleWare */
/* Esto permite que pueda leer en el post json */
app.use(express.json());
/* Dum: funcion para ver la ruta solicitada */
app.use(logger);
var claveToken = require("../config/config");
var Usuario = require("../models/usuario");
/* google */
const CLIENT_ID = require("../config/config").CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

/* Autentificación de google */
//-------------------------------------------------------------
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    };
}

app.post('/google', async(req, respuesta) => {
    var token = req.body.token;
    var googleUser = await verify(token).catch(e => {
        return respuesta.status(500).json({
            ok: false,
            mensaje: "Token no válido"
        });
    });
    respuesta.status(200).json({
        ok: true,
        mensaje: 'Respuesta rapida funciona',
        googleUser: googleUser
    });
});
//-------------------------------------------------------------


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
        usuarioBaseDato.password = "";
        var token = jsonWebToken.sign({ usuario: usuarioBaseDato }, claveToken.SEED, { expiresIn: 14000 }); //token 4 horas

        respuesta.status(200).json({
            ok: true,
            body: usuarioBaseDato,
            id: usuarioBaseDato.id,
            token: token
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