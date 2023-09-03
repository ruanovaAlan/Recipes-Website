const express = require('express');
const router = express.Router();
const user = require('../controllers/userController')
const passport = require('passport');
const { storeReturnTo } = require('../middleware/verification');

router.route('/register')
    .get(user.getRegister)
    .post(user.postRegister);

router.route('/login')
    .get(user.getLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.postLogin);

router.route('/logout')
    .get(user.logout);

module.exports = router;