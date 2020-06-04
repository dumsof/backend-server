var express = require("express");
var bcrypt = require("bcrypt");

var app = new express();

/* MedlleWare */
/* Esto permite que pueda leer en el post json */
app.use(express.json());
/* Dum: funcion para ver la ruta solicitada */
app.use(logger);

var Usuario = require("../models/usuario");
var mdAutentificacion = require("../middlewares/autentificacion");

/* Obtener todos los usuarios */
app.get("/", (request, respuesta, next) => {
    var desde = request.query.desde || 0;
    desde = Number(desde);
    /* DUM para que solo devuelva las columnas que se especifican excec */
    Usuario.find({}, "nombre apellidos email img role")
        .skip(desde)
        .limit(5)
        .exec(
            (error, usuarios) => {
                if (error) {
                    return respuesta.status(500).json({
                        ok: false,
                        mensaje: "Error cargando usuario base de datos",
                        errors: error,
                    });
                }
                Usuario.count({}, (error, cantidadRegistro) => {
                    respuesta.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: cantidadRegistro
                    });
                });

            }
        );
});


/* Crear un nuevo usuario */
/* DUM: para que el metodo trabaje con el token mdAutentificacion.verificarToken  */
app.post("/" /* , mdAutentificacion.verificarToken */ , (req, respuesta) => {
    /* solo funciona con la libreria body parse */
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
    });

    usuario.save((error, usuarioGuardado) => {
        if (error) {
            return respuesta.status(400).json({
                ok: false,
                mensaje: "Error al crear usuario en la base de datos",
                errors: error,
            });
        }
        respuesta.status(201).json({
            ok: true,
            body: usuarioGuardado,
            usuarioToke: req.usuario /* este usuario se catura en el middleware verificar token del decoded */
        });
    });
});

/* Actualizar usuario */
app.put("/:id", mdAutentificacion.verificarToken, (req, respuesta) => {
    /* solo funciona con la libreria body parse */
    var id = req.params.id;
    console.log("El id que se envio", id);
    Usuario.findById(id, (error, usuario) => {
        if (error) {
            return respuesta.status(500).json({
                ok: false,
                mensaje: "Error Base de Datos, Buscar usuario Actualizar",
                errors: error,
            });
        }
        if (!usuario) {
            return respuesta.status(400).json({
                ok: false,
                mensaje: `El usuario con el id ${id} no existe`,
                errors: { message: "No existe un usuario con ese ID" },
            });
        }
        var body = req.body;
        console.log(body);

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
            respuesta.status(201).json({
                ok: true,
                usuario: usuarioGuardado,
            });
        });
    });
});

/* Borrar un usuario por id */

app.delete('/:id', mdAutentificacion.verificarToken, (req, respuesta) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {
        if (error) {
            return respuesta.status(500).json({
                ok: false,
                mensaje: "Error borrar usuario",
                errors: error,
            });
        }
        if (!usuarioBorrado) {
            return respuesta.status(400).json({
                ok: false,
                mensaje: `El usuario con el id [${id}] no existe para ser borrado`,
                errors: { message: "No existe un usuario con ese ID" },
            });
        }
        respuesta.status(200).json({
            ok: true,
            body: usuarioBorrado,
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