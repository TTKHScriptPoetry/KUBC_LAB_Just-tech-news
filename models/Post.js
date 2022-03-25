const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {
   static upvote(body, models) {  // we are passing in { Vote } for parameter models
      return models.Vote.create({
         user_id: body.user_id,
         post_id: body.post_id
      }).then(() => {
         return Post.findOne({  // return what is found
            where: {
            id: body.post_id
            },
            attributes: [
               'id',
               'post_url',
               'title',
               'created_at',
               [
                  sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                  'vote_count'
               ]
            ]
         });
      });
   }
}

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