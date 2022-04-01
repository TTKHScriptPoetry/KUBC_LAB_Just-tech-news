const path = require('path');
const express = require('express');
const session = require('express-session');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 5001;
const exphbs = require('express-handlebars');
// const hbs = exphbs.create({});
const hbs = exphbs.create({ helpers });

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// This code sets up an Express.js session and connects the session to our Sequelize database

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
  app.listen(PORT, () =>  console.log(`http://localhost:${PORT}/ \nhttp://localhost:${PORT}/login`));
  
});

// npm i express-session connect-session-sequelize

// The express-session library allows us to connect to the back end. The connect-session-sequelize  
// library automatically stores the sessions created by express-session into our database.