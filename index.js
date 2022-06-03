const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController")

const Article = require("./articles/Article");
const Category = require("./categories/Category");


//DATABASE CONNECTION
connection
    .authenticate()
    .then(() => {
        console.log("Conexão com o BD estabelecida!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })


//EJS + PUBLIC
app.set('view engine', 'ejs');
app.use(express.static('public'));


//BODY-PARSER
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// CONTROLLERS
app.use("/",categoriesController);
app.use("/",articlesController);


//ROTAS
app.get("/",(req,res) => {
    Article.findAll().then(articles => {
        res.render("index",{
            articles:articles
        });
    })
})

app.listen(1010, () => {
    console.log("App rodando...")
})