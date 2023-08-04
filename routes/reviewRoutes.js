const Recipe = require('../models/recipe');
const Review = require('../models/review');
const express = require('express');
const router = express.Router({ mergeParams: true }); //mergeParams (allowed to delete reviews)
const { isLoggedIn, storeReturnTo } = require('../middleware/verification');

router.post('/', storeReturnTo, async (req,res) => {
    const recipe = await Recipe.findById(req.body.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    console.log(recipe, review)
    recipe.reviews.push(review);
    await review.save();
    await recipe.save();
    console.log(recipe, review)
    req.flash('success', 'Review creado correctamente');
    res.redirect(`/recipes/${recipe.id}`);
})

router.delete('/:reviewId', async(req,res) => {
    const { id, reviewId } = req.params;
    console.log(id, reviewId)
    await Recipe.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    //$pull removes a specified document from an array
    await Review.findById(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/recipes/${id}`);
})



module.exports = router;
