const imagen = require("../model/imagen");
const producto = require("../model/producto");

module.exports = {
    async index(req, res) {
        const productos = await producto.all();
        res.render("productos/index", { productos });
    },
    async create(req, res) {
        res.render("productos/create");
    },
    async store(req, res) {
        await producto.create(req.body);
        const _producto = await producto.last();
        await imagen.createMany(req.body, _producto.id);
        res.redirect('/productos');
    }
}