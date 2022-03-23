// -- Imported the Model class and DataTypes object from Sequelize
const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// class User extends Model {}

// -- Create our User model
class User extends Model {
  // set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
    {
      // --first object defines the columns and data types for those columns
      // define an id column
      id: {
       
        type: DataTypes.INTEGER,  // use the special Sequelize DataTypes object provide what type of data it is
        allowNull: false,    // this is the equivalent of SQL's `NOT NULL` option
        primaryKey: true,    // instruct that this is the Primary Key
        autoIncrement: true  // turn on auto increment
      },
      // --define a username column
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      // --define an email column
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,    // there cannot be any duplicate email values in this table
        validate: {
          isEmail: true  // if allowNull is set to false, we can run our data through validators before creating the table data
        }
      },
      // --define a password column
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4]  // this means the password must be at least four characters long
        }
      }
    }, // end of 1st object
    {
      // -- The second object accepts configures for the table/model
      // hooks property was added to the second object
      // Version II :  async/await syntax -- one single variable that is input and output after the password hashing modification.
      hooks:{
        // to inject hasing logic to occur just before a user is created:
        async beforeCreate(newUserData) { // userData stores the pre-hash
          newUserData.password = await bcrypt.hash(newUserData.password, 10);
          return newUserData;
        }
      },
      // // Version I : one single variable to store the pre-hash and post-hash data
      // hooks:{
      //   // to inject hasing logic to occur just before a user is created:
      //   beforeCreate(userData) { // userData stores the pre-hash
      //     return bcrypt.hash(userData.password, 10) // 10 is the value of saltRounds
      //       .then(newUserData => { // resulted hashed password (post-hash data) is then passed to the Promise object as a newUserData object
      //         return newUserData  //returning the hashed password and exit out of the function
      //       });
      //   }
      // },
      // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))
      sequelize,  // pass in our imported sequelize connection (the direct connection to our database)
      timestamps: false, // don't automatically create createdAt/updatedAt timestamp fields
      freezeTableName: true, // don't pluralize name of database table
      underscored: true, // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
      modelName: 'user'  // make it so our model name stays lowercase in the database

    } // end of 2nd object
      // https://sequelize.org/v5/manual/models-definition.html#configuration
);

module.exports = User;