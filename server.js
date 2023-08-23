const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// mount routes
app.use(routes);

// start server once database connection is open
db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
    });
  });