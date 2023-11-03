const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes");


app.use('/files', express.static('files'))

app.use("/", routes);

app.use(bodyParser.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);


// Configura EJS como motor de plantillas
app.set("view engine", "ejs");

app.set("views", __dirname + "/views");

const port = 3000;
// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
