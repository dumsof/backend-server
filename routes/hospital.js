var express = require("express");
var app = new express();

/* MedlleWare */
/* Esto permite que pueda leer en el post json */
app.use(express.json());
/* Dum: funcion para ver la ruta solicitada */
app.use(logger);

var Hospital = require("../models/hospital");
var mdAutentificacion = require("../middlewares/autentificacion");

/* Obtener todos los hospitales */
app.get("/", (request, respuesta, next) => {
    /* DUM para que solo devuelva las columnas que se especifican excec */
    Hospital.find({}, "nombre img usuario").exec(
        (error, hospitales) => {
            if (error) {
                return respuesta.status(500).json({
                    ok: false,
                    mensaje: "Error cargando hospital base de datos",
                    errors: error,
                });
            }
            respuesta.status(200).json({
                ok: true,
                hospitales: hospitales,
            });
        }
    );
});

/* Crear Hospital */
app.post("/", mdAutentificacion.verificarToken, (req, respuesta) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
    });
    hospital.save((error, hospitalGuardado) => {
        if (error) {
            return respuesta.status(400).json({
                ok: false,
                mensaje: "Error al crear hospital en la base de dato",
                errors: error,
            });
        }
        respuesta.status(200).json({
            ok: true,
            body: hospitalGuardado,
            usuarioToke: req.usuario /* este usuario se catura en el middleware verificar token del decoded */
        });
    });
});

/* Actualizar usuario */
app.put("/:id", /*  mdAutentificacion.verificarToken, */ (req, respuesta) => {
    var id = req.params.id;
    Hospital.findById(id, (error, hospital) => {
        if (error) {
            return respuesta.status(500).json({
                ok: false,
                mensaje: "Error Base de Datos, Buscar hospital Actualizar",
                errors: error,
            });
        }
        if (!hospital) {
            return respuesta.status(400).json({
                ok: false,
                mensaje: `El hospital con el id ${id} no existe`,
                errors: { message: "No existe un hospital con ese ID" },
            });
        }
        var body = req.body;
        console.log(body);

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = body.usuario;

        hospital.save((error, hospitalGuardado) => {
            if (error) {
                return respuesta.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar usuario",
                    errors: error,
                });
            }
            respuesta.status(201).json({
                ok: true,
                body: hospitalGuardado,
            });
        });
    });
});

/* Borrar un hospital por id */
app.delete('/:id' /* , mdAutentificacion.verificarToken */ , (req, respuesta) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (error, hospitalBorrado) => {
        if (error) {
            return respuesta.status(500).json({
                ok: false,
                mensaje: "Error borrar hospital",
                errors: error,
            });
        }
        if (!usuarioBorrado) {
            return respuesta.status(400).json({
                ok: false,
                mensaje: `El hospital con el id [${id}] no existe para ser borrado`,
                errors: { message: "No existe un hospital con ese ID" },
            });
        }
        respuesta.status(200).json({
            ok: true,
            body: hospitalBorrado,
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