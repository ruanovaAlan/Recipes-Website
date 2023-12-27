if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const ExpressError = require('./utils/expressError');
const methodOverride = require("method-override");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const MongoStore = require('connect-mongo');

const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');

const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');



const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/Recipes";
mongoose.connect(dbUrl); //local database

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

//Set the url encoded to parse the body
app.use(express.urlencoded({ extended: true }));
//Set the update route
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, '/public')));


//Mongo store
const secret = process.env.SECRET || 'thisShouldBeSecret'
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
})
store.on("error", function(e) {
    console.log("Session store error")
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
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
//helmet
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://ka-f.fontawesome.com",
    "https://kit.fontawesome.com/",
    "https://ka-f.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://ka-f.fontawesome.com",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/"
];
const connectSrcUrls = ["https://ka-f.fontawesome.com"];
const fontSrcUrls = ["https://ka-f.fontawesome.com/", "https://fonts.gstatic.com"];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", 'https://ka-f.fontawesome.com', 'https://fonts.gstatic.com'],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dmt9srumx/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://i.postimg.cc/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//passport
app.use(passport.initialize());
app.use(passport.session()); //this line needs to be below "app.use(session(sessionConfig))"
passport.use(new passportLocal(User.authenticate())); //Tell passport we want to use a local strategy and 
// for this strategy we want to authenticate User
passport.serializeUser(User.serializeUser()); //how do we store data in session
passport.deserializeUser(User.deserializeUser()); //how do we get a user out of the serialization
//Mongo sanitize
app.use(mongoSanitize());

app.use((req, res, next) => { //Flash 
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//router
app.use('/recipes', recipeRoutes);
app.use('/recipes/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

//home page
app.get('/', (req,res) => {
    res.render('home.ejs')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh NO, Something went wrong';
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving Port ${port}`);
})