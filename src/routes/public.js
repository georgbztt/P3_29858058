const express = require('express');
const producto = require('../model/producto');
const productoController = require('../controller/producto');
const categoria = require('../model/categoria');
const user = require('../model/user');
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
                res.redirect('/cliente');
            }
        } else {
            res.send('Credenciales incorrectas. Inténtalo de nuevo.');
        }

    } catch (error) {
        res.send('Credenciales incorrectas. Inténtalo de nuevo.');
    }



    // const { username, password } = req.body;
    // const user = users.find(u => u.username === username && u.password === password);
    // if (user) {
    //     req.session.user = user; // Almacena el usuario en la sesión
    //     res.redirect('/admin');
    // } else {
    //     res.send('Credenciales incorrectas. Inténtalo de nuevo.');
    // }
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



module.exports = router; 