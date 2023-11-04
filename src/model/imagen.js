const db = require('../database/conection');
module.exports = {
    async createMany(body, producto_id) {
        const imagenes = body.imagen;
        return new Promise((suc, rej) => {
            db.serialize(function () {
                try {
                    const stmt = db.prepare("INSERT INTO imagenes (url, producto_id) VALUES (?,?)");
                    imagenes.forEach(imagen => {
                        stmt.run(imagen, producto_id);
                    });
                    stmt.finalize();
                    suc(true);
                } catch (error) {
                    rej(error)
                }
            });
        })
    },
    deleteMany(producto_id) {
        return new Promise((suc, rej) => {
            db.serialize(function () {
                try {
                    const stmt = db.prepare(`DELETE from imagenes where producto_id = ? `);
                    stmt.run(producto_id);
                    stmt.finalize();
                    suc(true);
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
                    const stmt = db.prepare(`DELETE from imagenes where id = ?`);
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
            db.all(`SELECT * from imagenes where id = ${id}`, function (err, rows) {
                if (err) {
                    rej(err.message)
                } else {
                    suc(rows[0])
                }
            });
        })
    },
    findAll(id) {
        return new Promise((suc, rej) => {
            db.all(`SELECT * from imagenes where producto_id = ${id}`, function (err, rows) {
                if (err) {
                    rej(err.message)
                } else {
                    suc(rows)
                }
            });
        })
    },
    update(data, producto_id) {
        const { url } = data;
        return new Promise((suc, rej) => {
            db.serialize(function () {
                try {
                    const stmt = db.prepare(`UPDATE imagenes set url = ? where id = ?`);
                    stmt.run(url);
                    stmt.finalize();
                    suc(data);
                } catch (error) {
                    rej(error)
                }
            });
        })
    }
}