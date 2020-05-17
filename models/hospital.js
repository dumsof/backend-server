var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    /* Dum: Crear relacion con la tabla usuario, se guardara el id del usuario */
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' });
/* DUM: el nombre en el modelo permite que la coleccion se llamae hospital en español y no en ingles */
module.exports = mongoose.model('Hospital', hospitalSchema);