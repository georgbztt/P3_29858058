const db = require('../database/conection');
module.exports = {
    all() {
        return new Promise((suc, rej) => {
            db.all('SELECT * from  order by id DESC', function (err, rows) {
                if (err) {
                    rej(err.message)
                } else {
                    suc(rows)
                }
            });
        })
    },
    create(data) {
        const { cantidad, total_pagado, cliente_id, producto_id, fecha } = data;

        console.log( { cantidad, total_pagado, cliente_id, producto_id, fecha });
        return new Promise((suc, rej) => {
            db.serialize(function () {
                try {
                    const stmt = db.prepare("INSERT INTO compras (cantidad, total_pagado, cliente_id, producto_id, ip_cliente, fecha) VALUES (?,?,?,?,?,?)");
                    stmt.run(cantidad, total_pagado, cliente_id, producto_id, 0, fecha);
                    stmt.finalize();
                    suc(data);
                } catch (error) {
                    rej(error)
                }
            });
        })
    },


    getProductoToCheckout(producto_id) {
        return new Promise((suc, rej) => {
            // Supongamos que los parámetros de filtro son 'marca', 'categoria' y 'nombre' en el query string

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
            const params = [producto_id];
            query += ` AND productos.id = ?`;


            // Ejecutar la consulta
            db.all(query, params, function (err, rows) {
                if (err) {
                    rej(err.message);
                } else {
                    suc(rows[0]);
                }
            });
        });
    }
}