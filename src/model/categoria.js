const db = require('../database/conection');
module.exports = {
    all() {
        return new Promise((suc, rej) => {
            db.all('SELECT * from categorias order by id DESC', function (err, rows) {
                if (err) {
                    rej(err.message)
                } else {
                    suc(rows)
                }
            });
        })
    },
    create(data) {
        const { nombre } = data;
        return new Promise((suc, rej) => {
            db.serialize(function () {
                try {
                    const stmt = db.prepare("INSERT INTO categorias (nombre) VALUES (?)");
                    stmt.run(nombre);
                    stmt.finalize();
                    suc(data);
                } catch (error) {
                    rej(error)
                }
            });
        })
    },
    delete(categoria_id) {
        return new Promise((suc, rej) => {
            db.serialize(function () {
                try {
                    const stmt = db.prepare(`DELETE from categorias where id = ?`);
                    stmt.run(categoria_id);
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
            db.all(`SELECT * from categorias where id = ${id}`, function (err, rows) {
                if (err) {
                    rej(err.message)
                } else {
                    suc(rows[0])
                }
            });
        })
    },
    update(data, categoria_id) {
        const { nombre } = data;
        return new Promise((suc, rej) => {
            db.serialize(function () {
                try {
                    const stmt = db.prepare(`UPDATE categorias set nombre = ? where id = ?`);
                    stmt.run(nombre);
                    stmt.finalize();
                    suc(data);
                } catch (error) {
                    rej(error)
                }
            });
        })
    }
}