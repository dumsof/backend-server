var express = require("express");
var app = new express();

/* MedlleWare */
/* Esto permite que pueda leer en el post json */
app.use(express.json());
/* Dum: funcion para ver la ruta solicitada */
app.use(logger);

var Medico = require("../models/medico");
var mdAutentificacion = require("../middlewares/autentificacion");

/* Obtener todos los medicos */
app.get("/", (request, respuesta, next) => {
    /* DUM para que solo devuelva las columnas que se especifican excec */
    Medico.find({}, "nombre img hospital usuario").exec(
        (error, medico) => {
            if (error) {
                return respuesta.status(500).json({
                    ok: false,
                    mensaje: "Error cargando medico base de datos",
                    errors: error,
                });
            }
            respuesta.status(200).json({
                ok: true,
                medicos: medico,
            });
        }
    );
});

/* Crear medico */
app.post("/", mdAutentificacion.verificarToken, (req, respuesta) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        hospital: body.hospital,
        usuario: req.usuario._id
    });
    medico.save((error, medicoGuardado) => {
        if (error) {
            return respuesta.status(400).json({
                ok: false,
                mensaje: "Error al crear medico en la base de dato",
                errors: error,
            });
        }
        respuesta.status(200).json({
            ok: true,
            body: medicoGuardado,
            usuarioToke: req.usuario /* TEMP: este usuario se catura en el middleware verificar token del decoded */
        });
    });
});

/* Actualizar usuario */
app.put("/:id", mdAutentificacion.verificarToken, (req, respuesta) => {
    var id = req.params.id;
    Medico.findById(id, (error, medico) => {
        if (error) {
            return respuesta.status(500).json({
                ok: false,
                mensaje: "Error Base de Datos, Buscar medico Actualizar",
                errors: error,
            });
        }
        if (!medico) {
            return respuesta.status(400).json({
                ok: false,
                mensaje: `El medico con el id ${id} no existe`,
                errors: { message: "No existe un medico con ese ID" },
            });
        }
        var body = req.body;
        console.log(body);

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.hospital = body.hospital;
        medico.usuario = req.usuario._id;

        medico.save((error, medicoGuardado) => {
            if (error) {
                return respuesta.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar usuario",
                    errors: error,
                });
            }
            respuesta.status(201).json({
                ok: true,
                body: medicoGuardado,
            });
        });
    });
});

/* Borrar un medico por id */
app.delete('/:id', mdAutentificacion.verificarToken, (req, respuesta) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (error, medicoBorrado) => {
        if (error) {
            return respuesta.status(500).json({
                ok: false,
                mensaje: "Error borrar medico",
                errors: error,
            });
        }
        if (!medicoBorrado) {
            return respuesta.status(400).json({
                ok: false,
                mensaje: `El medico con el id [${id}] no existe para ser borrado`,
                errors: { message: "No existe un medico con ese ID" },
            });
        }
        respuesta.status(200).json({
            ok: true,
            body: medicoBorrado,
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