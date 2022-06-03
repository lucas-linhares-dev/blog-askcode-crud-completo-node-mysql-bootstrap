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




app.get("/",(req,res) => {
    Article.findAll({
        order:[['id','DESC']],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories =>{
            res.render("index",{
                articles:articles,
                categories:categories
            });
        })
    })
})



// ARTIGO ESPECIFICO
app.get("/:slug",(req,res) => {
    let slug = req.params.slug;
    Article.findOne({
        where:{
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("article",{
                    article: article,
                    categories:categories
                })
            })
        }
        else{
            res.redirect("/")
        }
    }).catch(erro => {
        res.redirect("/")
    })
})


app.get("/category/:slug",(req,res)=>{
    let slug = req.params.slug;
    Category.findOne({
        where:{
            slug:slug
        },
        include:[{model:Article}]
    }).then(category =>{
        if(category != undefined){
            Category.findAll().then(categories=>{
                res.render("index",{
                    categories:categories,
                    articles:category.articles
                })
            })
        }
        else{
            res.redirect("/")
        }
    }).catch(Erro =>{
        res.redirect("/")
    })
})



app.listen(1010, () => {
    console.log("App rodando...")
})