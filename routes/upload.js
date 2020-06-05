var express = require('express');
var fileUpload = require('express-fileupload');
var fileSystem = require('fs');

var app = new express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

app.put("/:tipo/:id", (request, respuesta, next) => {
    var tipo = request.params.tipo;
    var id = request.params.id;

    /* tipo de colecciones valido */
    var tiposValidas = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidas.indexOf(tipo) < 0) {
        return respuesta.status(400).json({
            ok: false,
            mensaje: "Tipos de colección no valida",
            errors: { message: 'Los tipos colección validos son ' + extensionesValidas.join(', ') }
        });
    }

    if (!request.files || Object.keys(request.files).length === 0) {
        return respuesta.status(400).json({
            ok: false,
            mensaje: "No selecciono dada",
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }
    /* Obtener nombre del archivo, validar tipo archivo */
    var archivo = request.files.imagen;
    var nombreSeparadoArchivo = archivo.name.split('.');
    var extensionArchivo = nombreSeparadoArchivo[nombreSeparadoArchivo.length - 1];
    /* solo extensiones validas */
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return respuesta.status(400).json({
            ok: false,
            mensaje: "Extensión no valida",
            errors: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

    /* nombre de archivo personalizado */
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
    /* mover el archivo direccion temp */
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    /* mover el archivo a las carpetas */
    archivo.mv(path, error => {
        if (error) {
            return respuesta.status(500).json({
                ok: false,
                mensaje: "Error al mover el archivo",
                errors: error
            });
        }
    });

    subirPorTipo(tipo, id, nombreArchivo, respuesta);
});

function subirPorTipo(tipo, id, nombreArchivo, respuesta) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (error, usuario) => {
            if (error || !usuario) {
                return respuesta.status(400).json({
                    ok: false,
                    mensaje: "No existe usuario con el id enviado",
                    errors: error
                });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
            /* verificar si existe archivo y borrar el anterior antes de actualizar el nuevo */
            if (pathViejo.lastIndexOf('.') > 0 && fileSystem.existsSync(pathViejo)) {
                fileSystem.unlinkSync(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((error, usuarioActual) => {
                if (error) {
                    return respuesta.status(500).json({
                        ok: false,
                        mensaje: "No se puede actualizar la imagen del usuario",
                        errors: error
                    });
                }
                return respuesta.status(200).json({
                    ok: true,
                    mensaje: "Imagen de usuario actualizada con éxito",
                    usuario: usuarioActual
                });
            });
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (error, medico) => {
            if (error || !medico) {
                return respuesta.status(400).json({
                    ok: false,
                    mensaje: "No existe médico con el id enviado",
                    errors: error
                });
            }
            var pathViejo = './uploads/medicos/' + medico.img;
            /* verificar si existe archivo y borrar el anterior antes de actualizar el nuevo */
            if (pathViejo.lastIndexOf('.') > 0 && fileSystem.existsSync(pathViejo)) {
                fileSystem.unlinkSync(pathViejo);
            }
            medico.img = nombreArchivo;
            medico.save((error, medicoActualizado) => {

                if (error) {
                    return respuesta.status(500).json({
                        ok: false,
                        mensaje: "No se puede actualizar la imagen del médico",
                        errors: error
                    });
                }
                return respuesta.status(200).json({
                    ok: true,
                    mensaje: "Imagen de médico actualizado con éxito",
                    medico: medicoActualizado
                });
            });
        });
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (error, hospital) => {
            if (error || !hospital) {
                return respuesta.status(400).json({
                    ok: false,
                    mensaje: "No existe hospital con el id enviado",
                    errors: error
                });
            }
            var pathViejo = './uploads/hospitales/' + hospital.img;
            /* verificar si existe archivo y borrar el anterior antes de actualizar el nuevo */
            if (pathViejo.lastIndexOf('.') > 0 && fileSystem.existsSync(pathViejo)) {
                fileSystem.unlinkSync(pathViejo);
            }
            hospital.img = nombreArchivo;
            hospital.save((error, hospitalActualizado) => {
                if (error) {
                    return respuesta.status(500).json({
                        ok: false,
                        mensaje: "No se puede actualizar la imagen del hospital",
                        errors: error
                    });
                }
                return respuesta.status(200).json({
                    ok: true,
                    mensaje: "Imagen de médico actualizado con hospital",
                    hospital: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;