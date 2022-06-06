function adminAuth(req, res, next){
    if(req.session.user != undefined){ // SESSION USER GERADA - USUARIO LOGADO
        next(); // LIBERA A COMUNICAÇÃO ENTRE REQ E RES
    }
    else{
        res.redirect("/login");
    }
}

module.exports = adminAuth;