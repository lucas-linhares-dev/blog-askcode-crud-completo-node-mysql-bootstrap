const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

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


//ROTAS
app.get("/",(req,res) => {
    res.render("home");
})

app.listen(1010, () => {
    console.log("App rodando...")
})