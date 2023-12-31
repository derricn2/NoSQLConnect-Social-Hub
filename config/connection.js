const mongoose = require('mongoose');

// connect to MongoDB database
mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/social-network', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = mongoose.connection;