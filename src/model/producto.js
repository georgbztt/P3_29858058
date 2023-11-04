const db = require('../database/conection');
module.exports = {
    all() {
        return new Promise((suc, rej) => {
            db.all('SELECT * FROM productos LEFT JOIN categorias ON productos.categoria_id = categorias.id ORDER BY productos.id DESC', function (err, rows) {
                if (err) {
                    rej(err.message)
                } else {
                    suc(rows)
                }
            });
        })
    },
    create(data) {
        console.log(data)
        const { nombre, descripcion, codigo, precio, marca, stock, categoria_id } = data;
        return new Promise((suc, rej) => {
            db.serialize(function () {
                try {
                    const stmt = db.prepare("INSERT INTO productos (nombre, descripcion, codigo, precio, marca, stock, categoria_id) VALUES (?,?,?,?,?,?,?)");
                    stmt.run(nombre, descripcion, codigo, precio, marca, stock, categoria_id);
                    stmt.finalize();
                    suc(data);
                } catch (error) {
                    rej(error)
                }
            });
        })
    },
    delete(producto_id) {
        return new Promise((suc, rej) => {
            db.serialize(function () {
                try {
                    const stmt = db.prepare(`DELETE from produtos where id = ?`);
                    stmt.run(producto_id);
                    stmt.finalize();
                    suc(true);
                } catch (error) {
                    rej(error)
                }
            });
        })
    },
    findOne(id) {
        return new Promise((suc, rej) => {
            db.all(`SELECT * from productos where id = ${id}`, function (err, rows) {
                if (err) {
                    rej(err.message)
                } else {
                    suc(rows[0])
                }
            });
        })
    },
    last() {
        return new Promise((suc, rej) => {
            db.all(`SELECT * from productos order by id DESC limit 1`, function (err, rows) {
                if (err) {
                    rej(err.message)
                } else {
                    suc(rows[0])
                }
            });
        })
    },
    update(data, producto_id) {
        const { nombre, descripcion, codigo, precio, marca, stock, catergoria_id } = data;
        return new Promise((suc, rej) => {
            db.serialize(function () {
                try {
                    const stmt = db.prepare(`UPDATE productos set nombre = ?, descripcion = ?, codigo = ?, precio = ?, marca = ?, stock = ?, catergoria_id = ?  where id = ?`);
                    stmt.run(nombre, descripcion, codigo, precio, marca, stock, catergoria_id, producto_id);
                    stmt.finalize();
                    suc(data);
                } catch (error) {
                    rej(error)
                }
            });
        })
    }
}