var jsonWebToken = require("jsonwebtoken");
var claveToken = require("../config/config");

//Verificar token
exports.verificarToken = function(req, respuesta, next) {

    var token = req.query.token;
    jsonWebToken.verify(token, claveToken.SEED, (error, decoded) => {
        if (error) {
            return respuesta.status(401).json({
                ok: false,
                mensaje: "El token no es valido.",
                errors: error,
            });
        }

        /* se toma la información que se envio en el token cuando se creo en el decoded */
        req.usuario = decoded.usuario;
        next();
    });

};