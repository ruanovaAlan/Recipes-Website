const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.get('/recipes', (req, res) => {
    res.send('HELLO')
})

app.listen(3000, () => {
    console.log("Serving Port 3000");
})