const imagen = require("../model/imagen");
const producto = require("../model/producto");
const categoria = require("../model/categoria");

module.exports = {
    async index(req, res) {
        const productos = await producto.all();
        res.render("productos/index", { productos });
    },
    async create(req, res) {
        const _categorias = categoria.all();
        res.render("productos/create", { _categorias });
    },
    async store(req, res) {
        await producto.create(req.body);
        const _producto = await producto.last();
        await imagen.createMany(req.body, _producto.id);
        res.redirect('/productos');
    },
    async show(req, res) {
        const { producto_id } = req.params
        const _producto = await producto.findOne(producto_id);
        const _imagenes = await imagen.findAll(producto_id);
        const _categorias = await categoria.all();
        res.render("productos/show", { _producto, _imagenes, _categorias });
    },
    async update(req, res) {
        const { producto_id } = req.params;
        const _producto = await producto.update(req.body, producto_id);
        await imagen.deleteMany(_producto.id);
        await imagen.createMany(req.body, _producto.id);
        res.redirect('/productos');
    },
}