const Sequelize = require("sequelize");
const connection = require("../database/database");

const Resposta = connection.define('respostas',{
    conteudo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    articleSlug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});


module.exports = Resposta;