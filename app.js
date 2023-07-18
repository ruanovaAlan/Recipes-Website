const express = require('express');
const path = require('path');
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const Recipe = require('./models/recipes')

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


//Routes
// app.get('/recipes', async (req, res) => { //Show all recipes
//     const recipes = await Recipe.find({});
//     res.render('recipes/index', { recipes });
// })

const categories = ['sopas aguadas y cremas', 'sopas-secas-y-pastas', 'carnes', 'soufflés', 'ensaladas', 'pasteles', 'pie', 'flan-y-gelatina', 'galletas-y-polvorones', 'nieve-y-otros'];
app.get('/recipes', async (req, res) => {
    const { seccion } = req.query;
    if (seccion) {
        const recipes = await Recipe.find({ seccion })
        res.render('recipes/index', { recipes, seccion })
    } else {
        const recipes = await Recipe.find({})
        res.render('recipes/index', { recipes, seccion: 'Todas las recetas' }) //show all products
    }
})

app.get('/recipes/:id', async (req, res) => { //Show a specific recipe
    const recipe = await Recipe.findById(req.params.id)
    res.render('recipes/show', { recipe })
})

app.listen(3000, () => {
    console.log("Serving Port 3000");
})