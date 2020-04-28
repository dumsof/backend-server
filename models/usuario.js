var mongoose = require("mongoose");

var Shema = mongoose.Schema;

var usuairoShema = new Shema({
    nombre: { type: String, require: [true, 'El nombre es necesario'] },
    apellidos: { type: String, require: [true, 'Los apellidos son necesario'] },
    email: { type: String, unique: true, require: [true, 'El email es necesario'] },
    password: { type: String, require: [true, 'La contraseña es necesario'] },
    img: { type: String },
    role: { type: String, require: true, default: 'USER_ROLE' }
});

module.exports = mongoose.model('Usuario', usuairoShema);