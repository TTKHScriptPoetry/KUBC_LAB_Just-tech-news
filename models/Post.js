const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {}

Post.init(
   {
      id: {
         type: DataTypes.INTEGER, 
         allowNull: false,
         primaryKey: true,
         autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      }, 
      post_url:{
         type: DataTypes.STRING,
         allowNull: false,
         validate:{
            isURL: true //Sequelize has the ability to offer validation in the schema definition
         } // end of validate
      },
      // -- defined as the foreign key and will be the matching link.
      // -- determines who posted the news article
      user_id:{ 
         type: DataTypes.INTEGER,
         references:{
            model: 'user',
            key: 'id'
         }
      } // last entity
   }, // end of 1st object      
   {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'post'
      
   }

   
);


module.exports = Post;