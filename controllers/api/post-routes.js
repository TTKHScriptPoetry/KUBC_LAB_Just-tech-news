const router01 = require('express').Router();
const {Post, User, Vote, Comment} = require('../../models');
const sequelize = require('../../config/connection');

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
router01.get('/', (req, res) => {
   Post.findAll({
      attributes: ['id', 'post_url', 
                  'title', 
                  'created_at',
                  [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
               ],
      order: [['created_at', 'DESC']], // This will ensure that the latest posted articles will appear first
      // we'll include the JOIN to the User table. We do this by adding the property include
      include: [ 
         {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {  // Comment model will also include the User model itself 
               model: User,
               attributes: ['username']
            }
         },
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

 router01.get('/:id', (req, res) => {
   Post.findOne({
      where: {
         id: req.params.id
      },
      attributes: ['id', 'post_url', 
         'title', 
         'created_at',
         [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
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
router01.post('/', (req, res) => {
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

// // // PUT /api/posts/upvote - PUT Version 3
router01.put('/upvote', (req, res) => {
   // make sure the session exists first
   if (req.session) {
     // pass session id along with all destructured properties on req.body
      Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
         .then(updatedVoteData => res.json(updatedVoteData))
         .catch(err => {
            console.log(err);
            res.status(500).json(err);
         });
   }
 });
// 
// // // PUT /api/posts/upvote - PUT Version 2
// router01.put('/upvote', (req, res) => {
//    // custom static method created in models/Post.js
//    Post.upvote(req.body, { Vote }) // make the call to the static method upvote() in Post class, expect someting in return
//      .then(updatedPostData => res.json(updatedPostData))
//      .catch(err => {
//        console.log(err);
//        res.status(400).json(err);
//      });
//  });

// // PUT /api/posts/upvote - PUT Version 1
// // An upvote request involves two queries: 
// // First, using the Vote model to CREATE a vote, 
// // Second, querying on that post to get an UPDATED vote count.
// router01.put('/upvote', (req, res) => {
//    Vote.create({
//       user_id: req.body.user_id,
//       post_id: req.body.post_id
//     }).then(() => {
//       return Post.findOne({
//          where: {
//             id: req.body.post_id
//          },
//          attributes: [
//             'id',
//             'post_url',
//             'title',
//             'created_at',
//             // use raw MySQL aggregate function query to get a count of how many votes 
//             // the post has and return it under the name `vote_count`
//             [
//                sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
//                'vote_count'
//             ]
//          ]
//       })
//       .then(dbPostData => res.json(dbPostData))
//       .catch(err => {
//          console.log(err);
//          res.status(400).json(err);
//       });
//    })
// });

 // -- Updating Post's Title
 router01.put('/:id', (req, res) => {
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
router01.delete('/:id', (req, res) => {
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



module.exports = router01;

