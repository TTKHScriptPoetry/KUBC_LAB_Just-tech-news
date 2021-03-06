const Sequelize = require('sequelize');
require('dotenv').config();

// // create connection to our db
// const sequelize = new Sequelize(process.env.DB_NAME, 
//                                 process.env.DB_USER, 
//                                 process.env.DB_PW, 
//                                 {
//                                   host: 'localhost',
//                                   dialect: 'mysql',
//                                   port: 3306
//                                 }
//                                 );

let sequelize;
// Does this take care of connection string
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    user: "root",
    password: "BietDanhM0i!",
    database: "just_tech_news_db"
  });
}

module.exports = sequelize;  