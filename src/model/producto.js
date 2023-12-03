const db = require('../database/conection');
module.exports = {
    oneWithImagen(producto_id) {
        return new Promise((suc, rej) => {
            db.all(`SELECT 
            productos.id, 
            productos.nombre, 
            productos.descripcion, 
            productos.precio, 
            productos.marca, 
            productos.categoria_id,
            categorias.nombre AS nombre_categoria,
            (SELECT imagenes.url FROM imagenes WHERE imagenes.producto_id = productos.id limit 1) AS imagen_destacada
            FROM productos
            LEFT JOIN categorias ON productos.categoria_id = categorias.id
            where productos.id = ${producto_id}
            `, function (err, rows) {
                if (err) {
                    rej(err.message)
                } else {
                    suc(rows[0])
                }
            });
        })
    },
    allWithImagen() {
        return new Promise((suc, rej) => {
            db.all(`SELECT 
            productos.id, 
            productos.nombre, 
            productos.descripcion, 
            productos.precio, 
            productos.marca, 
            productos.categoria_id,
            categorias.nombre AS nombre_categoria,
            (SELECT imagenes.url FROM imagenes WHERE imagenes.producto_id = productos.id limit 1) AS imagen_destacada
            FROM productos
            LEFT JOIN categorias ON productos.categoria_id = categorias.id`, function (err, rows) {
                if (err) {
                    rej(err.message)
                } else {
                    suc(rows)
                }
            });
        })
    },
    all() {
        return new Promise((suc, rej) => {
            db.all('SELECT t1.id, t1.nombre, t1.descripcion, t1.codigo, t1.precio, t1.marca, t1.stock, t1.categoria_id ,t2.nombre as categoria FROM productos as t1 LEFT JOIN categorias as t2 ON t1.categoria_id = t2.id ORDER BY t1.id DESC', function (err, rows) {
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
                    const stmt = db.prepare(`DELETE from productos where id = ?`);
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
        console.log(id)
        return new Promise((suc, rej) => {
            db.all(`SELECT t1.id, t1.nombre, t1.descripcion, t1.codigo, t1.precio, t1.marca, t1.stock, t1.categoria_id ,t2.nombre as categoria FROM productos as t1 LEFT JOIN categorias as t2 ON t1.categoria_id = t2.id where t1.id = ${id}`, function (err, rows) {
                if (err) {
                    console.log(err)
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
        const { nombre, descripcion, codigo, precio, marca, stock, categoria_id } = data;
        return new Promise((suc, rej) => {
            db.serialize(function () {
                try {
                    const stmt = db.prepare(`UPDATE productos set nombre = ?, descripcion = ?, codigo = ?, precio = ?, marca = ?, stock = ?, categoria_id = ?  where id = ?`);
                    stmt.run(nombre, descripcion, codigo, precio, marca, stock, categoria_id, producto_id);
                    stmt.finalize();
                    data.id = producto_id;
                    suc(data);
                } catch (error) {
                    rej(error)
                }
            });
        })
    },
    getMarcas() {
        return new Promise((suc, rej) => {
            db.all(`SELECT marca, COUNT(*) as cantidad FROM productos GROUP BY marca;`, function (err, rows) {
                if (err) {
                    rej(err.message)
                } else {
                    suc(rows)
                }
            });
        })
    },
    getFiltred(req) {
        return new Promise((suc, rej) => {
            // Supongamos que los parámetros de filtro son 'marca', 'categoria' y 'nombre' en el query string
            const marcaFilter = req.query.marca;
            const categoriaFilter = req.query.categoria;
            const nombreFilter = req.query.nombre;
            const descripcionFilter = req.query.descripcion;
            const precioFilter = req.query.precio;
            console.log(req.query)

            // Construir la consulta con los filtros si existen
            let query = `SELECT 
            productos.id, 
            productos.nombre, 
            productos.descripcion, 
            productos.precio, 
            productos.marca, 
            productos.categoria_id,
            categorias.nombre AS nombre_categoria,
            (SELECT imagenes.url FROM imagenes WHERE imagenes.producto_id = productos.id limit 1) AS imagen_destacada
            FROM productos
            LEFT JOIN categorias ON productos.categoria_id = categorias.id where 1`; // WHERE 1 es siempre verdadero, para poder agregar condiciones con AND

            // Parámetros para la consulta preparada, si es necesario
            const params = [];

            if (!!marcaFilter && marcaFilter != '') {
                query += ` AND marca = ?`;
                console.log('MARCA ISSET')
                params.push(marcaFilter);
            }

            if (!!categoriaFilter && categoriaFilter != '') {
                query += ` AND productos.categoria_id = ?`;
                console.log('categoria_id ISSET')
                params.push(categoriaFilter);
            }

            if (!!precioFilter && precioFilter != '') {
                query += ` AND productos.precio = ?`;
                console.log('precio ISSET')
                params.push(precioFilter);
            }

            if (!!nombreFilter && nombreFilter != '') {
                query += ` AND productos.nombre LIKE ?`;
                console.log('nombre ISSET')
                params.push(`%${nombreFilter}%`); // Utilizamos % para buscar coincidencias parciales
            }

            if (!!descripcionFilter && descripcionFilter != '') {
                query += ` AND productos.descripcion LIKE ?`;
                console.log('descripcion ISSET')
                params.push(`%${descripcionFilter}%`); // Utilizamos % para buscar coincidencias parciales
            }

            // Ejecutar la consulta
            db.all(query, params, function (err, rows) {
                if (err) {
                    rej(err.message);
                } else {
                    suc(rows);
                }
            });
        });
    }
}