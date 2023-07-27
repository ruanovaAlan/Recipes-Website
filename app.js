const express = require('express');
const path = require('path');
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const Recipe = require('./models/recipe')
const ExpressError = require('./utils/expressError');

const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');

const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user');



//Connection to mongoose
mongoose.connect("mongodb://127.0.0.1:27017/Recipes");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection erro:"));
db.once("open", () => {
    console.log("Database connected");
});

//Set the app
const app = express();

//Set engine view and path
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, '/public')))

//Set the url encoded to parse the body
app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
    secret: 'secretRecipes',
    resave: false, //erase deprecation warning 
    saveUninitialized: true, //erase deprecation warning 
    cookie: { //especify options for cookies
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //miliseconds, seconds, hours, hours-per-day, days-week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
//flash 
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session()); //this line needs to be below "app.use(session(sessionConfig))"
passport.use(new passportLocal(User.authenticate())); //Tell passport we want to use a local strategy and 
// for this strategy we want to authenticate User
passport.serializeUser(User.serializeUser()); //how do we store data in session
passport.deserializeUser(User.deserializeUser()); //how do we get a user out of the serialization

app.use((req, res, next) => { //Flash 
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//router
app.use('/recipes', recipeRoutes);
app.use('/', userRoutes);

app.listen(3000, () => {
    console.log("Serving Port 3000");
})