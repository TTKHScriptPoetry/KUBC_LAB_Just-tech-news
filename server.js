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
sequelize.sync({ force: false }).then(() => {  
   // If force were set to true, it would drop and re-create all of the database tables on startup
   // This is great for when we make changes to the Sequelize models
  // app.listen(PORT, () => console.log('Now listening'));
  app.listen(PORT, () =>  console.log(`http://localhost:${PORT}/users/login`));
});