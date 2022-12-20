// backend/routes/api/users.js
const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// Middleware:
// The POST /api/users signup route will expect the body of the request to have a key of username, email, and password with the password of the user being created.
// Make a middleware called validateSignup that will check these keys and validate them:
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    check('firstName')
      .exists({checkFalsy:true})
      .withMessage('Must include first name'),
    check('lastName')
      .exists({checkFalsy:true})
      .withMessage('Must include last name'),
    handleValidationErrors
  ];


// Sign up
//POST /api/users
router.post( '/', validateSignup,  async (req, res,next) => {
      const { email, password, username, firstName, lastName } = req.body;

      // Special case to handle unique email constraint
      let user;
      try{
        user = await User.signup({ email, username, password, firstName, lastName });
      } catch(err){
        const emailErr = new Error('User already exists');
        emailErr.status = 403;
        emailErr.title = 'User Signup Failed - Accound already exists';
        emailErr.errors=['Provided email is already in use.']
        next(emailErr);
      }
      await setTokenCookie(res, user);

      return res.json({
        user: user
      });
    }
  );

module.exports = router;
