const express = require('express');
const producto = require('./controller/producto');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("home");
});

router.get('/productos', (req, res) => {
    producto.index(req,res);
});

router.get('/productos/create', (req, res) => {
    producto.create(req,res);
});

router.post('/productos', (req, res) => {
    // console.log(req.body)
    // res.send('qlq')
     producto.store(req,res);
});


module.exports = router; // You export the intance