const http = require("http");
const express = require("express");
const db = require("./config/config");
const body_parser = require("body-parser");
const cors = require("cors");
const methodOverride = require("method-override");
const morgan = require("morgan");
const socketManager = require("./sockets/socketManager");
const routerApp = require("./network/routes");
const path = require("path");

const app = express();

// CADENA DE MIDDLEWARES
app.use(body_parser.urlencoded({ extended: false }));
app.use(cors());
app.use(methodOverride());
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(express.json());
// app.use(morgan('dev'))

app.set("view engine", "ejs"); // Configurando la extensión de vista como ".ejs"
app.set("views", path.join(__dirname, "public", "views")); // Ruta a las vistas

//Conectando a la Base de datos
// db('mongodb://127.0.0.1:27017/TEMCHAT');
db(process.env.MONGO_DATABASE_URI);

//Haciendo uso del router en el servidor como middleware
routerApp(app);

//Sirviendo Estaticos
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "public/index.html");
});

app.get("*", (req, res) => {
  const dataPage = {
    tittlePage: "404 Error!",
    code: 404,
    errorMessage: "404 Oops!",
    errorSubMessage: "Recurso no encontrado",
    imageError: true
  };
  res.render("Error/index", dataPage);
});

const server = http.createServer(app);

socketManager(server);

const PORT = process.env.PORT || 80;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
