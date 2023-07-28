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

router.get('/favorites', storeReturnTo, isLoggedIn, async (req, res) => {
    const user = res.locals.currentUser = req.user;
    const notPrepared = await Favorite.find({ status: 'sin-preparar', user: user._id }).populate('recipe');
    const prepared = await Favorite.find({ status: 'preparado', user: user._id }).populate('recipe');
    const liked = await Favorite.find({ status: 'me-gusta', user: user._id }).populate('recipe');
    const notLiked = await Favorite.find({ status: 'no-gusta', user: user._id }).populate('recipe');
    res.render('users/favorites', { notPrepared, prepared, liked, notLiked });
})

router.post('/favorites', storeReturnTo, isLoggedIn, async (req, res) => {
    const { recipeId } = req.body;
    const user = res.locals.currentUser = req.user;
    const favorite = new Favorite({ recipe: recipeId, user: user._id })
    await favorite.save()
    req.flash('success', 'Recipe Saved!');
    res.redirect('back');
})

router.get('/:id', storeReturnTo, isLoggedIn, async (req, res) => { //Show a specific recipe
    const recipe = await Recipe.findById(req.params.id)
    res.render('recipes/show', { recipe })
})


module.exports = router