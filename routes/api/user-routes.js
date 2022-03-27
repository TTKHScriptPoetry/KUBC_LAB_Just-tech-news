const router02 = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');  

// Create API endpoints to execute CRUD on a Post

// GET /api/users
router02.get('/', (req, res) => {   
   User.findAll({
      // attributes: {exclude: ['password']}  // to not return password data
   })   
   .then(dbUserData => res.json(dbUserData))
   .catch(err => {
      console.log(err);
      res.status(500).json(err);
   });
});

// GET /api/users/1
router02.get('/:id', (req, res) => {
   User.findOne({
      attributes: { exclude: ['password']},
      where: {
         id: req.params.id
         },
      include: [
         {
            model: Post,
            attributes: ['id', 'title', 'post_url', 'created_at']
         },
         // include the Comment model here:
         {
            model: Comment,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
            model: Post,
            attributes: ['title']
            }
         },
         {
            model: Post,
            attributes: ['title'],
            through: Vote,
            as: 'voted_posts'
         }
      ]         
   })
      .then(dbUserData => {
         if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbUserData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
});

// POST /api/users
router02.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
   User.create({
         username: req.body.username,
         email: req.body.email,
         password: req.body.password
      })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
   });
});

// PUT /api/users/1
router02.put('/:id', (req, res) => {
   // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
   User.update(req.body, {
      where: {
         id: req.params.id
      }
   })
      .then(dbUserData => {
         if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbUserData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });

});

// DELETE /api/users/1
router02.delete('/:id', (req, res) => {
   User.destroy({
      where: {
         id: req.params.id
      }
    })
      .then(dbUserData => {
         if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
         }
         res.json(dbUserData);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });

});

// More: 
// A GET method carries the request parameter appended in the URL string, whereas 
// a POST method carries the request parameter in req.body, which makes it a more 
// secure way of transferring data from the client to the server

router02.post('/login', (req, res) => {
   // expects {email: 'lernantino@gmail.com', password: 'password1234'}
      User.findOne({
         where: {
            email: req.body.email
         }
      }).then(dbUserData => {
         if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
         }
      
         //  res.json({ user: dbUserData });
      
         // Verify user
         const validPassword = dbUserData.checkPassword(req.body.password);
         if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
         }
         res.json({ user: dbUserData, message: 'You are now logged in!' });
      });  
   });

module.exports = router02;