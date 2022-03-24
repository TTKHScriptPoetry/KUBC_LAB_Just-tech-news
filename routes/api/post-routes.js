const router = require('express').Router();
const {Post, User} = require('../../models');

// Stratergy: In a query to the post table, we would like to retrieve not only 
// information about each post, but also the user that posted it. With the 
// foreign key, user_id, we can form a JOIN, an essential characteristic of the relational data model.

// get all users
// --------------------------------------------------------------------------------------------------------
// 'SELECT `post`.`id`, `post`.`post_url`, `post`.`title`, `post`.`create_at`, `user`.`id` AS `user.id`, `user`.`username` 
// AS `user.username` FROM `post` AS `post` LEFT OUTER JOIN `user` AS `user` ON `post`.`user_id` = `user`.`id`;',

// INSERT INTO post (title, post_url, user_id, created_at, updated_at)
//  -> VALUES ("Taskmaster goes public!", "https://taskmaster/press", 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
// --------------------------------------------------------------------------------------------------------
router.get('/', (req, res) => {
   Post.findAll({
      attributes: ['id', 'post_url', 'title', 'created_at'],
      order: [['created_at', 'DESC']], // This will ensure that the latest posted articles will appear first
      // we'll include the JOIN to the User table. We do this by adding the property include
      include: [ 
         {
            model: User,
            attributes: ['username']
         }
      ]
   })
   .then(dbPostData => res.json(dbPostData)) // common
   .catch(err => {
      console.log(err);
      res.status(500).json(err);
   });
 });

router.get('/:id', (req, res) => {
   Post.findOne({
      where: {
         id: req.params.id
      },
      attributes: ['id', 'post_url', 'title', 'created_at'],
      include: [
         {
         model: User,
         attributes: ['username']
         }
      ]
   })
   .then(dbPostData => {
      if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
      }
      res.json(dbPostData); // common
   })
   .catch(err => {
      console.log(err);
      res.status(500).json(err);
   });
});

// INSERT INTO post (title, post_url, user_id, created_at, updated_at)
//  -> VALUES ("Taskmaster goes public!", "https://taskmaster/press", 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
// --------------------------------------------------------------------------------------------------------
router.post('/', (req, res) => {
   // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
   Post.create({
     title: req.body.title,
     post_url: req.body.post_url,
     user_id: req.body.user_id
   })
     .then(dbPostData => res.json(dbPostData)) // common 
  // .then(dbPostData => { if(!dbPostData) { } res.json(dbPostData); })
     .catch(err => {
       console.log(err);
       res.status(500).json(err);
     });
 });

 // -- Updating Post's Title
router.put('/:id', (req, res) => {
Post.update(
      {
         post_url: req.body.post_url, // update post_url and title 
         title: req.body.title 
      },
      {
         where: {
         id: req.params.id
         }
      }
   )
   .then(dbPostData => {
      if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
      }
      res.json(dbPostData);  // common // In the response, we sent back data that has been modified and stored in the database.
   })
   .catch(err => {
      console.log(err);
      res.status(500).json(err);
   });

// -- Delete a Post
router.delete('/:id', (req, res) => {
   Post.destroy({
         where: {
            id: req.params.id
         }
      })
      .then(dbPostData => {
         if (!dbPostData) {
         res.status(404).json({ message: 'No post found with this id' });
         return;
         }
         res.json(dbPostData); // common 
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err); 
      });
   });
}); 

module.exports = router;

