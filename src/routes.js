const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("home");
});

router.get('/productos', (req, res) => {
    res.render("productos/index");
});


module.exports = router; // You export the intance