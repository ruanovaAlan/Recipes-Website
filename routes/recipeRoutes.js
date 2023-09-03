const express = require('express');
const router = express.Router();
const recipes = require('../controllers/recipeController');
const { isLoggedIn, storeReturnTo } = require('../middleware/verification');

router.route('/')
    .get(recipes.index)//view all recipes
    .post(recipes.newRecipe);


router.route('/addRecipe')
    .get(recipes.addRecipe);



router.route('/favorites')
    .get(isLoggedIn, recipes.viewFavorites)
    .post(isLoggedIn, recipes.addFavorite)
    .patch(recipes.changeStatus)
    .delete(recipes.deleteFavorite);

router.route('/:id')
    .get(recipes.viewRecipe);


module.exports = router;