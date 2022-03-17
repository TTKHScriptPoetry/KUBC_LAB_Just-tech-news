// allowing the API to be scalable
// more API endpoints will be added in this file
// use this file to collect endpoints and give them their prefixed name
const router = require('express').Router();
const userRoutes = require('./user-routes.js');

router.use('/users', userRoutes);

module.exports = router;