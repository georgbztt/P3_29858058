const express = require('express');
const producto = require('../model/producto');
const router = express.Router();


router.get('/', async (req, res) => {
    const productos = await producto.all();
    console.log(productos);
    res.render("public/index", { productos });
});

router.get('/producto/1', (req, res) => {
    res.render("public/producto");
});


// Ruta de inicio de sesión
router.get('/login', (req, res) => {
    res.send('Por favor, inicia sesión:<br><form method="POST" action="/login"><input type="text" name="username" placeholder="Nombre de usuario"><input type="password" name="password" placeholder="Contraseña"><input type="submit" value="Iniciar sesión"></form>');
});

// Procesar la solicitud POST de inicio de sesión
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = user; // Almacena el usuario en la sesión
        res.redirect('/dashboard');
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