const imagen = require("../model/imagen");
const producto = require("../model/producto");
const categoria = require("../model/categoria");

module.exports = {
    validarDatos(data) {
        const { nombre, descripcion, codigo, precio, marca, stock, categoria_id } = data;

        const errores = [];

        if (!nombre || typeof nombre !== 'string') {
            errores.push('El campo "nombre" es requerido y debe ser una cadena.');
        }

        if (!descripcion || typeof descripcion !== 'string') {
            errores.push('El campo "descripcion" es requerido y debe ser una cadena.');
        }

        if (!codigo || typeof codigo !== 'string') {
            errores.push('El campo "codigo" es requerido y debe ser una cadena.');
        }

        if (isNaN(parseFloat(precio)) || precio <= 0) {
            errores.push('El campo "precio" es requerido y debe ser un número mayor que cero.');
        }

        if (!marca || typeof marca !== 'string') {
            errores.push('El campo "marca" es requerido y debe ser una cadena.');
        }

        if (isNaN(parseInt(stock)) || stock < 0) {
            errores.push('El campo "stock" es requerido y debe ser un número mayor o igual a cero.');
        }

        if (!categoria_id || typeof categoria_id !== 'string') {
            errores.push('El campo "categoria_id" es requerido y debe ser una cadena.');
        }

        return errores;
    },
    async index(req, res) {
        const productos = await producto.all();
        res.render("productos/index", { productos });
    },
    async create(req, res) {
        const _categorias = await categoria.all();
        console.log(_categorias)
        res.render("productos/create", { _categorias });
    },
    async store(req, res) {

        const errores = this.validarDatos(req.body);
        if (errores.length > 0) {
            res.send(errores);
            return false;
        }


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

        const errores = this.validarDatos(req.body);
        if (errores.length > 0) {
            res.send(errores);
            return false;
        }

        const { producto_id } = req.params;
        const _producto = await producto.update(req.body, producto_id);
        await imagen.deleteMany(_producto.id);
        await imagen.createMany(req.body, _producto.id);
        res.redirect('/productos');
    },
    async delete(req, res) {
        const { producto_id } = req.params
        await producto.delete(producto_id);
        res.redirect('/productos');
        // res.render("productos/show", { _producto, _imagenes, _categorias });
    },
}