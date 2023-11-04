const express = require('express');
const producto = require('./controller/producto');
const categoria = require('./controller/categoria');
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


router.get('/categorias', (req, res) => {
    categoria.index(req,res);
});
router.get('/categorias/:categoria_id', (req, res) => {
    categoria.show(req,res);
});
router.post('/categorias/:categoria_id', (req, res) => {
    categoria.update(req,res);
});
router.get('/categorias/delete/:categoria_id', (req, res) => {
    categoria.delete(req,res);
});


module.exports = router;