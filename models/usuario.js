var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuairoShema = new Schema({
    nombre: { type: String, require: [true, 'El nombre es necesario'] },
    apellidos: { type: String, require: [true, 'Los apellidos son necesario'] },
    email: { type: String, unique: true, require: [true, 'El email es necesario'] },
    password: { type: String, require: [true, 'La contraseña es necesario'] },
    img: { type: String, require: false },
    role: { type: String, require: true, default: 'USER_ROLE', enum: rolesValidos }
});

usuairoShema.plugin(uniqueValidator, { message: 'El {PATH} debe ser unico.' });
module.exports = mongoose.model('Usuario', usuairoShema);