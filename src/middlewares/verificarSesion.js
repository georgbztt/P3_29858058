function verificarSesion(req, res, next) {
    if (req.session.user) {
        next(); // El usuario ha iniciado sesión, permite el acceso a la siguiente función middleware o ruta
    } else {
        res.redirect('/login'); // El usuario no ha iniciado sesión, redirige al inicio de sesión
    }
}

module.exports = verificarSesion;