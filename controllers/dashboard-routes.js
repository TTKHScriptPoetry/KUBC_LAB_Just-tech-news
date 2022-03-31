const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth'); 

module.exports = router;

// // -- Most simple action to test new route/view per get ---------------------
// router.get('/', (req, res) => {
//    res.render('dashboard', { loggedIn: true }); // this makes login-button appear, logout-button invisible
// });

// to prevent the user to see dashboard by browing to URL http://localhost:3001/dashboard, add
// withAuth paras to the route that renders dashboard

router.get('/', withAuth, (req, res) => {
   Post.findAll({
     where: {
       // use the ID from the session
       user_id: req.session.user_id
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
       // serialize data before passing to template
       const posts = dbPostData.map(post => post.get({ plain: true }));
       res.render('dashboard', { posts, loggedIn: true });
     })
     .catch(err => {
       console.log(err);
       res.status(500).json(err);
     });
});

router.get('/edit/:id', withAuth, (req, res) => {
  Post.findByPk(req.params.id, {
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
      if (dbPostData) {
        const post = dbPostData.get({ plain: true });
        console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
        console.log(post);
        res.render('edit-post', {
          post,
          loggedIn: true
        });
      } else {
        res.status(404).end();
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete('/edit/:id',withAuth , (req, res) => {
  // delete one product by its `id` value
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbPostData => {
    if (!dbPostData) {
    res.status(404).json({ message: 'No product found with this id' });
    return;
    }
    res.json(dbPostData); // common
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  });
});

 