// Initialize Express Application
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const { ValidationError } = require('sequelize');


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


app.use((req,res,next)=>{
  //create an error object to use in later routes
  req.errorObj={};
  req.errorArray=[];
  next();
})

app.use(routes); // Connect all the routes

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
  });


// ...

// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = 'Validation error';
  }
  next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
      // title: err.title || 'Server Error',
      message: err.message,
      statusCode:err.status,
      errors:  Array.isArray(err.errors) ? undefined : err.errors
      // stack: isProduction ? null : err.stack
    });
  });

// backend/app.js
// ...

module.exports = app;
