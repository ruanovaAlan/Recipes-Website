const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Recipe = require('./recipe');
const User = require('./user');

const favoriteSchema = new Schema({
    status: {
        type: String,
        lowercase: true,
        enum: ['preparado', 'sin-preparar', 'me-gusta', 'no-gusta'],
        default: 'sin-preparar'
    },
    recipe: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Favorite', favoriteSchema);