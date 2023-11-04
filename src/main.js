const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes");
const public = require("./routes/public");
const session = require('express-session');


// Configura express-session
app.use(session({
    secret: 'mi_secreto', // Cambia esto por tu secreto
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // Duración de la cookie en milisegundos (1 hora en este caso)
}));


app.use('/files', express.static('files'))

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());



const users = [
    { id: 1, username: 'usuario1', password: 'password1' },
    { id: 2, username: 'usuario2', password: 'password2' },
  ];



// Ruta protegida
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.send('¡Has accedido al panel de control!');
    } else {
        res.redirect('/login');
    }
});



app.use("/", public);
app.use("/admin", routes);


// Configura EJS como motor de plantillas
app.set("view engine", "ejs");

app.set("views", __dirname + "/views");

const port = 3000;
// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
