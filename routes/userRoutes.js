const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware/verification');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => { //middleware to login when register
            if (err) return next(err);
            req.flash('success', "Welcome to Rousy's Kitchen");
            res.redirect('/recipes');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
})

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const redirectUrl = res.locals.returnTo || '/recipes';
    if (redirectUrl === '/recipes/favorites') {
        res.redirect('/recipes')
    }
    req.flash('success', 'Welcome Back!');
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye');
        res.redirect('/recipes');
    });
})


module.exports = router;