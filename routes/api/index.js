const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');

// route requests for users and thoughts to their respectice route files
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;