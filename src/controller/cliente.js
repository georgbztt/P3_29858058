const imagen = require("../model/imagen");
const producto = require("../model/producto");
const categoria = require("../model/categoria");
const user = require("../model/user");
require('dotenv').config();

module.exports = {
    async index(req, res) {
        const shoppings = await user.getAllShopping(req.session.user.id)
        console.log({shoppings})
        res.render("clientes/index", { shoppings });
    },
}