const Recipe = require('../models/recipe');
const Favorite = require('../models/favorite');
const { cloudinary } = require('../cloudinary');


module.exports.index = async(req,res) => { //view all recipes
    const { seccion } = req.query;
    const favorite = await Favorite.find({ user: res.locals.currentUser }).populate('recipe');
    if (seccion) {
        const recipes = await Recipe.find({ seccion }).populate('reviews');
        res.render('recipes/index', { recipes, seccion, favorite })
    } else {
        const recipes = await Recipe.find({}).populate('reviews');
        res.render('recipes/index', { recipes, seccion: 'Todas las recetas', favorite }) //show all products
    }
};

module.exports.addRecipe = (req,res) => {
    res.render('recipes/new');
}

module.exports.newRecipe = async(req,res) => {
    const { titulo, ingredientes, seccion, tipo} = req.body;
    const imagen = req.file.path;
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
};

module.exports.viewFavorites = async(req,res) => {
    const user = res.locals.currentUser = req.user;
    const recipes = await Recipe.find({})
    const favorite = await Favorite.find({ user: res.locals.currentUser }).populate('recipe');
    const notPrepared = await Favorite.find({ status: 'sin-preparar', user: user._id }).populate('recipe');
    const prepared = await Favorite.find({ status: 'preparado', user: user._id }).populate('recipe');
    const liked = await Favorite.find({ status: 'me-gusta', user: user._id }).populate('recipe');
    const notLiked = await Favorite.find({ status: 'no-gusta', user: user._id }).populate('recipe');
    res.render('users/favorites', { notPrepared, prepared, liked, notLiked, favorite, recipes });
}

module.exports.addFavorite = async(req,res) => {
    const { recipeId } = req.body;
    const user = res.locals.currentUser = req.user;
    const favorite = new Favorite({ recipe: recipeId, user: user._id })
    await favorite.save()
    req.flash('success', 'Se agregó la receta a favoritos');
    res.redirect('/recipes');
    
}

module.exports.changeStatus = async(req,res) => {
    const { recipeId, newStatus } = req.body;
    const favorite = await Favorite.findByIdAndUpdate(
        recipeId,
        { status: newStatus },
        { new: true }
    );
    req.flash('success', 'Estatus Modificado Exitosamente!');
    res.redirect(`/recipes/favorites`);
}

module.exports.deleteFavorite = async(req,res) => {
    const { recipeId } = req.body;
    const favorite = await Favorite.findOne({ recipe: recipeId });
    const deletefavorite = await Favorite.findByIdAndDelete(favorite._id);
    req.flash('success', 'Se eliminó la receta de favoritos');
    res.redirect('/recipes');
}

module.exports.viewRecipe = async(req,res) => {
    const recipe = await Recipe.findById(req.params.id).populate({
        path: 'reviews', populate: { //nested populate; populate the reviews
            path: 'author' //populate the author of the review
        }
    }).populate('author');
    res.render('recipes/show', { recipe })
}