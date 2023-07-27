const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe')
const Favorite = require('../models/favorite');
const { isLoggedIn, storeReturnTo } = require('../middleware/verification');

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

router.get('/favorites', (req, res) => {
    res.render('users/favorites');
})

router.post('/favorites', isLoggedIn, async (req, res) => {
    req.flash('success', 'Recipe Saved!');
    const { recipeId } = req.body;

    res.redirect('back');
})

router.get('/:id', storeReturnTo, isLoggedIn, async (req, res) => { //Show a specific recipe
    const recipe = await Recipe.findById(req.params.id)
    res.render('recipes/show', { recipe })
})


module.exports = router