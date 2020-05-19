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

    var desde = request.query.desde || 0;
    desde = Number(desde);

    /* DUM para que solo devuelva las columnas que se especifican excec */
    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email') /* con esto se obtiene informacion de la otra tabla y con el segundo parametro los campos */
        .populate('hospital')
        .exec(
            (error, medico) => {
                if (error) {
                    return respuesta.status(500).json({
                        ok: false,
                        mensaje: "Error cargando medico base de datos",
                        errors: error,
                    });
                }
                Medico.count({}, (error, cantidadRegistro) => {
                    respuesta.status(200).json({
                        ok: true,
                        medicos: medico,
                        total: cantidadRegistro
                    });
                });
            }
        );
});

/* Crear medico */
app.post("/", mdAutentificacion.verificarToken, (req, respuesta) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
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
        respuesta.status(201).json({
            ok: true,
            medico: medicoGuardado
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
                medico: medicoGuardado,
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
            medico: medicoBorrado,
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