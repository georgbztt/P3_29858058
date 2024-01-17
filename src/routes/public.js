const fetch = require("node-fetch");
const express = require('express');
const producto = require('../model/producto');
const productoController = require('../controller/producto');
const categoria = require('../model/categoria');
const user = require('../model/user');
const compraController = require('../controller/compra');
const compra = require('../model/compra');
const cliente = require("../controller/cliente");
const verificarSesion = require("../middlewares/verificarSesion");
const router = express.Router();
require('dotenv').config();

console.log(process.env.ADMIN, process.env.PASSWORD)

// const users = [
//     { id: 1, username: process.env.ADMIN, password: process.env.PASSWORD },
// ];

router.get('/', async (req, res) => {
    const productos = await producto.allWithImagen();
    console.log(productos)
    res.render("public/index", { productos });
});

router.get('/producto', async (req, res) => {
    const productos = await producto.getFiltred(req);
    const marcas = await producto.getMarcas();
    const categorias = await categoria.all();
    const view = 'producto';
    res.render("public/productos", { productos, marcas, categorias, view });
});

router.get('/producto-lists', async (req, res) => {
    const productos = await producto.getFiltred(req);
    const marcas = await producto.getMarcas();
    const categorias = await categoria.all();
    const view = 'producto-lists';
    res.render("public/producto-lists", { productos, marcas, categorias, view });
});

router.get('/producto/:producto_id', (req, res) => {
    productoController.preview(req, res)
});

// router.get('/comprar/:producto_id', (req, res) => {
//     productoController.preview(req, res)
// });


// Ruta de inicio de sesión
router.get('/login', (req, res) => {
    res.render('public/login')
    // res.send('Por favor, inicia sesión:<br><form method="POST" action="/login"><input type="text" name="username" placeholder="Nombre de usuario"><input type="password" name="password" placeholder="Contraseña"><input type="submit" value="Iniciar sesión"></form>');
});

// Procesar la solicitud POST de inicio de sesión
router.post('/login', async (req, res) => {
    try {
        // console.log(req.body);
        const usuario = await user.login(req.body);
        // console.log({ usuario });
        if (usuario) {
            req.session.user = usuario; // Almacena el usuario en la sesión
            if (usuario.is_admin) {
                res.redirect('/admin');
            } else {
                res.redirect('/');
            }
        } else {
            res.send('Credenciales incorrectas. Inténtalo de nuevo.');
        }

    } catch (error) {
        res.send('Credenciales incorrectas. Inténtalo de nuevo.');
    }
});

// Ruta para cerrar la sesión
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});


// Ruta de inicio de sesión
router.get('/registro', (req, res) => {
    res.render('public/registro-clientes')
    // res.send('Por favor, inicia sesión:<br><form method="POST" action="/login"><input type="text" name="username" placeholder="Nombre de usuario"><input type="password" name="password" placeholder="Contraseña"><input type="submit" value="Iniciar sesión"></form>');
});

// Procesar la solicitud registro POST de inicio de sesión
router.post('/registro', async (req, res) => {
    try {
        await user.create(req.body)
        res.redirect('/login');
    } catch (error) {
        res.send('Error al guardar el usuario');
    }
});



router.get('/checkout/', verificarSesion, (req, res) => {
    compraController.checkout(req, res);
});

router.post('/procesar-pago', async (req, res) => {

    try {

        const url = 'https://fakepayment.onrender.com/payments';
        const data = {
            "card-number": req.body['card-number'],
            cvv: req.body['cvv'],
            "expiration-month": req.body['expiration-month'],
            "expiration-year": req.body['expiration-year'],
            "full-name": req.body['full-name'],
            "currency": "USD",
            "description": req.body['producto-name'],
            "amount": req.body['amount'],
            "reference": "paymen_id:10002"
        };

        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJkYXRlIjoiMjAyNC0wMS0xNlQyMTo1NjozNS4zMDZaIiwiaWF0IjoxNzA1NDQyMTk1fQ.kBNmUGp6l2eWOHP5kjjk7X4jW-w3iiJ_BDDqHfplnSM';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                res.send('Error al procesar documento');
                throw new Error(`Error de red - ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Respuesta exitosa:', responseData);

            const dataInsert = {
                cantidad: req.body['cantidad'],
                total_pagado: responseData.data.amount,
                cliente_id: req.session.user.id,
                producto_id: req.body['producto_id'],
                fecha: responseData.data.date
            }
            await compra.create(dataInsert);
            res.redirect('/cliente')

        } catch (error) {
            console.error('Error en la solicitud:', error);
        }


    } catch (error) {
        console.log(error);
        res.send('Error al procesar pago');
    }

});

router.get('/cliente', verificarSesion, (req, res) => {
    cliente.index(req, res);
});



module.exports = router; 