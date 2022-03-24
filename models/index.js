// All this file is responsible for right now is importing the User model 
// and exporting an object with it as a property

const User = require('./User');
const Post = require("./Post");

// create associations
User.hasMany(Post, {
   foreignKey: 'user_id' //user_id in the Post model, where user_id thus is a foreigh key
 })

 // assert the reverse association 
Post.belongsTo(User, {
foreignKey: 'user_id',
}); 

// We will need to drop the table and create a new one in order for the associations to take affect
// { force: false } If we change the value of the force property to true, then the database connection 
// must sync with the model definitions and associations.
// Value true: we will make the tables re-create if there are any association changes.
// Equivalent to DROP TABLE IF EXISTS

module.exports = { User, Post };