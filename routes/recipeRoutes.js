const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe')
const Favorite = require('../models/favorite');
const { isLoggedIn, storeReturnTo } = require('../middleware/verification');

router.get('/', async (req, res) => { //view all recipes
    const { seccion } = req.query;
    const favorite = await Favorite.find({ user: res.locals.currentUser }).populate('recipe');
    if (seccion) {
        const recipes = await Recipe.find({ seccion })
        res.render('recipes/index', { recipes, seccion, favorite })
    } else {
        const recipes = await Recipe.find({})
        res.render('recipes/index', { recipes, seccion: 'Todas las recetas', favorite }) //show all products
    }
});

router.get('/addRecipe', (req,res) => {
    res.render('recipes/new');
})

router.post('/', async (req, res) => {
    const { titulo, imagen, ingredientes, seccion, tipo} = req.body;
    console.log(ingredientes)
    const ingredientList = ingredientes.slice(1);
    const formattedIngredients = ingredientList.map(ingredient => `${ingredient}`).join('\r\n');
    
    const procedureSteps = [];
    for (let i = 1; i <= Number(req.body.procedureCounter); i++) {
        if (req.body[`proceso-${i}`]) {
            procedureSteps.push(req.body[`proceso-${i}`]);
        }
    }
    // Agregar números a cada paso del procedimiento
    const formattedProcedure = procedureSteps.map((step, index) => `${index + 1}. ${step}`).join('\r\n');

    const newRecipe = new Recipe({
        titulo,
        imagen,
        ingredientes: formattedIngredients,
        proceso: formattedProcedure,
        seccion,
        tipo,
    });
    await newRecipe.save()
    console.log(newRecipe);
    res.redirect("/recipes");
});


router.get('/favorites', isLoggedIn, async (req, res) => {
    const user = res.locals.currentUser = req.user;
    const recipes = await Recipe.find({})
    const favorite = await Favorite.find({ user: res.locals.currentUser }).populate('recipe');
    const notPrepared = await Favorite.find({ status: 'sin-preparar', user: user._id }).populate('recipe');
    const prepared = await Favorite.find({ status: 'preparado', user: user._id }).populate('recipe');
    const liked = await Favorite.find({ status: 'me-gusta', user: user._id }).populate('recipe');
    const notLiked = await Favorite.find({ status: 'no-gusta', user: user._id }).populate('recipe');
    res.render('users/favorites', { notPrepared, prepared, liked, notLiked, favorite, recipes });
})

router.post('/favorites', isLoggedIn, async (req, res) => {
    const { recipeId } = req.body;
    const user = res.locals.currentUser = req.user;
    const favorite = new Favorite({ recipe: recipeId, user: user._id })
    await favorite.save()
    req.flash('success', 'Se agregó la receta a favoritos');
    res.redirect('back');
})

router.patch('/favorites', async (req, res) => {
    const { recipeId, newStatus } = req.body;
    const favorite = await Favorite.findByIdAndUpdate(
        recipeId,
        { status: newStatus },
        { new: true }
    );
    req.flash('success', 'Estatus Modificado Exitosamente!');
    res.redirect(`back`);
})

router.delete('/favorites', async (req, res) => {
    const { recipeId } = req.body;
    const favorite = await Favorite.findOne({ recipe: recipeId });
    const deletefavorite = await Favorite.findByIdAndDelete(favorite._id);
    req.flash('success', 'Se eliminó la receta de favoritos');
    res.redirect('/recipes');
})

router.get('/:id', async (req, res) => { //Show a specific recipe
    const recipe = await Recipe.findById(req.params.id).populate({
        path: 'reviews', populate: { //nested populate; populate the reviews
            path: 'author' //populate the author of the review
        }
    }).populate('author');
    res.render('recipes/show', { recipe })
})


module.exports = router;