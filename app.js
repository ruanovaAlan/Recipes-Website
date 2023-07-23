const express = require('express');
const path = require('path');
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const Recipe = require('./models/recipes')
const recipeRoutes = require('./routes/recipeRoutes');


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

//router
app.use('/recipes', recipeRoutes);

app.listen(3000, () => {
    console.log("Serving Port 3000");
})