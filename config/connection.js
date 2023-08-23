const mongoose = require('mongoose');

// connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/social_network_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

module.exports = mongoose.connection;