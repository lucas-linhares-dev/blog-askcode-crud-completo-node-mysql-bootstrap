const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");

const categoriesController = require("./categories/categoriesController");
const usersController = require("./users/usersController");
const articlesController = require("./articles/articlesController")

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");
const Resposta = require("./articles/Resposta");

const adminAuth = require("./middlewares/adminAuth");


//Redis -- Storage -- SALVAMENTO DE SESSOES -- SESSIONS NAO FICAM NA MEMORIA DO SERVER


//Session
app.use(session({
    secret: "wiksldkipoqkalldkwoo",
    cookie:{ // REFERENCIA DO BROWSER PARA A SESSAO NO SERVIDOR
        maxAge: 30000000
    }
}))

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
app.use("/",usersController);




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

app.post("/responder", adminAuth, (req,res)=>{
    let conteudoResposta = req.body.conteudo;
    let articleSlug = req.body.articleSlug;
    Resposta.create({
        conteudo: conteudoResposta,
        articleSlug:articleSlug
    }).then(()=>{
        res.redirect("/"+articleSlug);
    })
})



// ARTIGO ESPECIFICO
app.get("/:slug", (req,res) => { // PROCURAR UM ELEMENTO POR UM CONTEÚDO ESPECÍFICO
    let slug = req.params.slug;

    Article.findOne({
        where:{
            slug: slug
        }
    }).then(article => {
        if(article != undefined){

            Category.findAll().then(categories =>{

                Resposta.findAll({
                    where:{
                        articleSlug:slug
                    },
                    order:[['id','DESC']]
                }).then(respostas=>{
                    res.render("article",{
                        article: article,
                        categories:categories,
                        respostas:respostas,
                    })
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
        include:[{model:Article}] // PUXA, PELO RELACIONAMENTO, OS ARTICLES DESTA CATEGORY ENCONTRADA
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