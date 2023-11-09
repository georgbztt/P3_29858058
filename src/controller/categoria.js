const imagen = require("../model/imagen");
const categoria = require("../model/categoria");

module.exports = {
    validarDatos(data) {
        const { nombre } = data;

        const errores = [];

        if (!nombre || typeof nombre !== 'string') {
            errores.push('El campo "nombre" es requerido y debe ser una cadena.');
        }

        return errores;
    },
    async index(req, res) {
        const categorias = await categoria.all();
        res.render("categorias/index", { categorias });
    },
    async create(req, res) {
        res.render("categorias/create");
    },
    async store(req, res) {
        const errores = this.validarDatos(req.body);
        if (errores.length > 0) {
            res.send(errores);
            return false;
        }
        await categoria.create(req.body);
        res.redirect('/admin/categorias');
    },
    async show(req, res) {
        const { categoria_id } = req.params
        const _categoria = await categoria.findOne(categoria_id);

        res.render("categorias/show", { _categoria });
    },
    async update(req, res) {

        const errores = this.validarDatos(req.body);
        if (errores.length > 0) {
            res.send(errores);
            return false;
        }

        console.log(req.body)
        const { categoria_id } = req.params;
        await categoria.update(req.body, categoria_id);

        res.redirect('/admin/categorias');
    },
    async delete(req, res) {
        const { categoria_id } = req.params
        await categoria.delete(categoria_id);
        res.redirect('/admin/categorias');
        // res.render("categorias/show", { _categoria, _imagenes, _categorias });
    },
}