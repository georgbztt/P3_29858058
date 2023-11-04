const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(__dirname + "/database.db");

db.serialize(function () {
    db.run(`CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT
    )`);
});

db.serialize(function () {
    db.run(`CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        descripcion TEXT,
        codigo TEXT,
        precio REAL NOT NULL,
        marca TEXT,
        stock INTEGER NOT NULL,
        categoria_id INTEGER,
        FOREIGN KEY(categoria_id) REFERENCES categorias(id)
        )`);
});

db.serialize(function () {
    db.run(`CREATE TABLE IF NOT EXISTS imagenes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT,
            producto_id INTEGER,
            destacado INTEGER,
            FOREIGN KEY(producto_id) REFERENCES producto(id)
    )`);
});

// Cierra la conexión a la base de datos al final


module.exports = db