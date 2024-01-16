function appedUserLocals(req, res, next) {
    console.log(req.session);
    if (req.session.user) {
        res.locals.name = req.session.user.name
        res.locals.email = req.session.user.email
        res.locals.id = req.session.user.id
        res.locals.is_admin = req.session.user.is_admin
    }else{
        res.locals.name = null
        res.locals.email = null
        res.locals.id = null
    }

    next(); // El usuario ha iniciado sesión, permite el acceso a la siguiente función middleware o ruta

}

module.exports = appedUserLocals;