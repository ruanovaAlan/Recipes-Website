const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe')

router.get('/', async (req, res) => {
    const { seccion } = req.query;
    if (seccion) {
        const recipes = await Recipe.find({ seccion })
        res.render('recipes/index', { recipes, seccion })
    } else {
        const recipes = await Recipe.find({})
        res.render('recipes/index', { recipes, seccion: 'Todas las recetas' }) //show all products
    }
})

router.get('/:id', async (req, res) => { //Show a specific recipe
    const recipe = await Recipe.findById(req.params.id)
    res.render('recipes/show', { recipe })
})

module.exports = router