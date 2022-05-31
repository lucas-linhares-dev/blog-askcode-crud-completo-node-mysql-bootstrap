const Sequelize = require("sequelize");

const connection = new Sequelize('blog','root','lucas321',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;