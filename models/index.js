// All this file is responsible for right now is importing the User model 
// and exporting an object with it as a property

const User = require('./User');
const Post = require("./Post");
const Vote = require("./Vote");
const Comment = require("./Comment");

// create associations
User.hasMany(Post, {
   foreignKey: 'user_id' //user_id in the Post model, where user_id thus is a foreigh key
 })

 // assert the reverse association 
Post.belongsTo(User, {
foreignKey: 'user_id',
}); 

// -- thru Vote table
User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',    // the name of the Vote model should be displayed as voted_posts when queried on
  foreignKey: 'user_id' // user_id in the Vote model, where user_id thus is a foreigh key
});

Post.belongsToMany(User, {
  through: Vote,
  as: 'voted_posts',    // the name of the Vote model should be displayed as voted_posts  
  foreignKey: 'post_id' // post_id in the Vote model
});

// we want to see which posts a-single-user voted on
// we want to see which users voted on a single-post

// user_id and post_id pairings must be unique to 
// void the possibility of a single user voting on 1 post multiple times

// Creating one-to-many associations directly between these models:
User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});

Vote.belongsTo(User, {
  foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});

// Comment model relationship
// Note that we don't have to specify Comment as a through table like we did for Vote. 
// This is because we don't need to access Post through Comment
Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Comment, {
  foreignKey: 'user_id'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

// We will need to drop the table and create a new one in order for the associations to take affect
// { force: false } If we change the value of the force property to true, then the database connection 
// must sync with the model definitions and associations.
// Value true: we will make the tables re-create if there are any association changes.
// Equivalent to DROP TABLE IF EXISTS

module.exports = { User, Post, Vote, Comment };