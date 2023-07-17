const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    seccion: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        lowercase: true,
        enum: ['salada', 'dulce'],
        required: true
    },
    ingredientes: {
        type: String,
        required: true
    },
    proceso: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    }
})

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;