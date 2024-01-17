const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes/privates");
const public = require("./routes/public");
const session = require('express-session');
require('dotenv').config();


const verificarSesion = require('./middlewares/verificarSesion');
const appedUserLocals = require('./middlewares/appedUserLocals');


// Configura express-session
app.use(session({
    secret: process.env.SESSIONTOKEN, // Cambia esto por tu secreto
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // Duración de la cookie en milisegundos (1 hora en este caso)
}));


app.use('/files', express.static('files'))

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use("/", appedUserLocals, public);
app.use("/admin", verificarSesion, routes);


// Configura EJS como motor de plantillas
app.set("view engine", "ejs");

app.set("views", __dirname + "/views");

const port = 3000;
// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
