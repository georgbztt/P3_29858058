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

router.post('/productos', (req, res) => {1
     producto.store(req,res);
});
router.get('/productos/:producto_id', (req, res) => {
     producto.show(req,res);
});

router.post('/productos/:producto_id', (req, res) => {
    producto.update(req,res);
});

router.get('/productos/delete/:producto_id', (req, res) => {
     producto.delete(req,res);
});


module.exports = router; // You export the intance