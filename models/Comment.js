const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init(
  {
      id: {
         type: DataTypes.INTEGER, 
         allowNull: false,
         primaryKey: true,
         autoIncrement: true
      },
      comment_text: {
         type: DataTypes.TEXT,
         allowNull: false,
         validate: {
            len: [1]  // this means the comment must be at least 1 character long
         }
      }, 
      user_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: 'user',
            key: 'id'
         }
      },
      post_id:{
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: 'post',
            key: 'id'
         }
      }
  }, // end of 1st object
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment'
  }
);

module.exports = Comment;