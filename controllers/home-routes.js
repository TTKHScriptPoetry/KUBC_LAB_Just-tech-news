// This file will contain all of the user-facing routes, such as the homepage and login page.
const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// // FIRST TEST OF Render()
// router.get('/', (req, res) => {
//    // hooked up a template engine use render()
//    // does this 'homepage' has anything to do with homepage.handlebars naming, homepage111 wont work
//    res.render('homepage' , {
//       id: 1,
//       post_url: 'https://handlebarsjs.com/guide/',
//       title: 'Handlebars Docs - Post Title',
//       created_at: new Date(),
//       vote_count: 11,
//       comments: [{}, {}],
//       user: {
//          username: 'test_user'
//       }
//    });  
// });

// -- The / designates Home
router.get('/', (req, res) => {
   console.log(req.session);
   Post.findAll({
      attributes: [
         'id',
         'post_url',
         'title',
         'created_at',
         [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
         {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
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
      .then(dbPostData => {
         console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
         console.log(dbPostData[0].get({ plain: true}));
         console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
         // // -- serilize and pass a single post object into the homepage template (only pass the first post)
         // res.render('homepage', dbPostData[0].get({ plain: true })); // Nice twist

         // to serialize the entire array
         const posts = dbPostData.map(eachdbpost => eachdbpost.get({ plain: true }));
        //  res.render('homepage',  { posts } ); // Nice twist
        res.render('homepage', {
          posts,
          loggedIn: req.session.loggedIn //conditional rendering
        });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json(err);
      });
 }); 

// -- Route to login.handlebars 
router.get('/login', (req, res) => {
   if (req.session.loggedIn) {
      res.redirect('/');
      return;
   }
   res.render('login');
}); 

// // -- Quick /post/:id Test Only
// router.get('/post/:id', (req, res) => {
//    const post = {
//      id: 1,
//      post_url: 'https://handlebarsjs.com/guide/',
//      title: 'Handlebars Docs',
//      created_at: new Date(),
//      vote_count: 10,
//      comments: [{}, {}],
//      user: {
//        username: 'test_user'
//      }
//    };
//  
//    res.render('single-post', { post });
// });

router.get('/post/:id', (req, res) => {
   Post.findOne({
     where: {
       id: req.params.id
     },
     attributes: [
       'id',
       'post_url',
       'title',
       'created_at',
       [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
     ],
     include: [
       {
         model: Comment,
         attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
         include: {
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
     .then(dbPostData => {
       if (!dbPostData) {
         res.status(404).json({ message: 'No post found with this id' });
         return;
       }
 
       // serialize the data
       const post = dbPostData.get({ plain: true });
 
      //  // pass data to template
      //  res.render('single-post', { post });
      res.render('single-post', {
        post,
        loggedIn: req.session.loggedIn
      });
     })
     .catch(err => {
       console.log(err);
       res.status(500).json(err);
     });
 });


module.exports = router;
