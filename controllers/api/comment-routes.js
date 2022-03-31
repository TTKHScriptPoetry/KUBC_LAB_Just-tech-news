const router03 = require('express').Router();
const {Post, User, Vote, Comment} = require('../../models');

router03.get('/', (req, res) => {
   Comment.findAll()
   .then(dbCommentData => res.json(dbCommentData)) // common
   .catch(err => {
      console.log(err.mesage);
      res.status(500)
         .json(err);

   });
})

router03.post('/', (req, res) => {
  // check the session
  if (req.session) {
      Comment.create({
      comment_text: req.body.comment_text,
      post_id: req.body.post_id,
      // use the id from the session
      user_id: req.session.user_id
      })
      .then(dbCommentData => res.json(dbCommentData))
      .catch(err => {
         console.log(err);
         res.status(400).json(err);
      });
  }
});

router03.delete('/:id', (req, res) => {

});


module.exports = router03;