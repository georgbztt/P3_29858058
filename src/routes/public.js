const express = require('express');
const producto = require('../model/producto');
const productoController = require('../controller/producto');
const router = express.Router();

const users = [
    { id: 1, username: 'admin@admin.com', password: 'password' },
    { id: 2, username: 'usuario2', password: 'password2' },
];

router.get('/', async (req, res) => {
    const productos = await producto.allWithImagen();
    console.log(productos)
    res.render("public/index", { productos });
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
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user; // Almacena el usuario en la sesión
        res.redirect('/admin');
    } else {
        res.send('Credenciales incorrectas. Inténtalo de nuevo.');
    }
});

// Ruta para cerrar la sesión
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router; 