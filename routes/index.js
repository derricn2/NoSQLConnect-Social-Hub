const router = require('express').Router();
const apiRoutes = require('./api');

// route all requests starting with '/api' to the API routes
router.use('/api', apiRoutes);

module.exports = router;