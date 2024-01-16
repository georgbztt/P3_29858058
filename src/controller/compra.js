const compra = require("../model/compra");

module.exports = {
    async checkout(req, res) {
        console.log(req.query);
        let producto = await compra.getProductoToCheckout(req.query.producto_id);
        let cantidad = req.query.cantidad;
        res.render("compras/checkout", { producto, cantidad });
    },


    async index(req, res) {
        const compras = await compra.all();
        res.render("compras/index", { compras });
    },
    async create(req, res) {
        res.render("compras/create");
    },
    async store(req, res) {
        const errores = this.validarDatos(req.body);
        if (errores.length > 0) {
            res.send(errores);
            return false;
        }
        await compra.create(req.body);
        res.redirect('/admin/compras');
    },
    async show(req, res) {
        const { compra_id } = req.params
        const _compra = await compra.findOne(compra_id);

        res.render("compras/show", { _compra });
    },
    async delete(req, res) {
        const { compra_id } = req.params
        await compra.delete(compra_id);
        res.redirect('/admin/compras');
        // res.render("compras/show", { _compra, _imagenes, _compras });
    },
}