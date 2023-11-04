const producto = require("../model/producto");

module.exports = {
    async index(req, res) {
        const productos = await producto.all();
        res.render("productos/index", { productos });
    },
    async create(req, res) {
        res.render("productos/create");
    }
}