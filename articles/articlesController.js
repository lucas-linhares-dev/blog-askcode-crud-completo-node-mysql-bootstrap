const express = require("express");
const router = express.Router();
const Article = require("../articles/Article");
const Category = require("../categories/Category")
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");


router.get("/admin/articles", adminAuth ,(req,res) => { // MEUS ARTIGOS
    Article.findAll({
        include:[{model:Category,required:true}] // REQUIRED TRUE SOLUCIONA PROBLEMA DE CAMPOS NULOS (CATEGORIA)
    }).then(articles => {
        res.render("admin/articles",{
            articles:articles
        })
    })
})

router.get("/admin/articles/new", adminAuth ,(req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{
            categories: categories
        })
    })
})

router.post("/articles/save",(req,res) => {
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    })
})

router.post("/articles/delete", (req,res) => {
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            })
        }
        else{
            res.redirect("/admin/articles");
        }
    }
    else{
        res.redirect("/admin/articles");
    }
})


router.get("/admin/articles/edit/:id", adminAuth ,(req,res)=>{
    let id = req.params.id;
    Article.findByPk(id).then(article=>{
        if(article != undefined){
            Category.findAll().then(categories=>{ // PUXANDO SEMPRE O MUDLO DE CATEGORIA, PARA PODER ESCOLHE-LA.
                res.render("admin/articles/edit",{
                    categories:categories,
                    article:article
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


router.post("/articles/update", adminAuth ,(req,res)=>{
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    Article.update({
        title:title,
        body: body,
        categoryId: category,
        slug:slugify(title),
    },{
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/articles");
    }).catch(Erro=>{
        res.redirect("/");
    })
})


router.get("/articles/page/:num",(req,res)=>{ // PAGINAÇÃO
    let page = req.params.num;
    let offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page)-1) * 4; // -1 (esquencendo primeira pagina- tratamento)
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order:[
            ['id','DESC']
        ]
    }).then(articles=>{

        let next;
        if(offset + 4 >= articles.count){ // MOSTRO OU NAO O "PROXIMA PAGINA"
            next = false;
        }else{
            next = true;
        }

        let result = {
            page:parseInt(page),
            next:next,
            articles: articles
        }


        Category.findAll().then(categories=>{
            res.render("admin/articles/page",{
                result: result,
                categories:categories
            })
        })

    })

})



module.exports = router;