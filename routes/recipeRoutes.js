const express = require('express');
const router = express.Router();
const recipes = require('../controllers/recipeController');
const { isLoggedIn, storeReturnTo } = require('../middleware/verification');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/recipes')
    .get(recipes.index)//view all recipes
    .post(upload.single('imagen'), recipes.newRecipe);
    // .post(upload.single('imagen'), (req,res)=> {
    //     console.log(req.body, req.file)
    //     res.send("It worked")
    // })

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