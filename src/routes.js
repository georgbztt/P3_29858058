const express = require('express');
const producto = require('./controller/producto');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("home");
});

router.get('/productos', (req, res) => {
    producto.index(req,res);
});


module.exports = router; // You export the intance