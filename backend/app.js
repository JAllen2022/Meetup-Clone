// Initialize Express Application
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Check to see if we're in a production environment or not
// Is production checking enviro key in config file backend/config/index.js
const { environment } = require('./config');
const isProduction = environment === 'production';

const app= express();

// Connect morgan midleware for logging info about
// requests and responses
app.use(morgan('dev'));

// Add cookie-parser to parse cookies
app.use(cookieParser());
// Add this to parse JSON request bodies
app.use(express.json());

// Only allow CORS in dev using cors middleware. Not needed for production
// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }

// helmet helps set a variety of headers to better secure your app
app.use(
helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
})
);

// Set the _csrf token and create req.csrfToken method
// Adds cookies to any server response
// Adds method on all requests - req.csrfToken
app.use(
csurf({
    cookie: {
    secure: isProduction,
    sameSite: isProduction && "Lax",
    httpOnly: true
    }
})
);


// backend/app.js
const routes = require('./routes');

// ...
app.use(routes); // Connect all the routes



// backend/app.js
// ...

module.exports = app;
