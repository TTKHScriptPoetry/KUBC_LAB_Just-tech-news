const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server

// The "sync" part means that this is 
// Sequelize taking the models and connecting them to associated database tables
// If it doesn't find a table, it'll create it for you!

// We will need to drop the table and create a new one in order for the associations to take affect
// { force: false } If we change the value of the force property to true, then the database connection 
// must sync with the model definitions and associations.
// Value true: we will make the tables re-create if there are any association changes.
// Equivalent to DROP TABLE IF EXISTS

// If force were set to true, it would drop and re-create all of the database tables on startup
// This is great for when we make changes to the Sequelize models

sequelize.sync({ force: false }).then(() => {  
  app.listen(PORT, () =>  console.log(`http://localhost:${PORT}/users/login`));
});