const User = require('../models/user');


module.exports.getRegister = (req,res) => {
    res.render('users/register');
}

module.exports.postRegister = async(req,res,next) => {
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
}

module.exports.getLogin = (req,res) => {
    res.render('users/login');
}

module.exports.postLogin = async(req,res) => {
    const redirectUrl = res.locals.returnTo || '/recipes';
    if (redirectUrl === '/recipes/favorites') {
        req.flash('success', 'Welcome Back!');
        return res.redirect('/recipes')
    }
    req.flash('success', 'Welcome Back!');
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye');
        res.redirect('/recipes');
    });
}