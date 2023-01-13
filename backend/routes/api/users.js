// backend/routes/api/users.js
const express = require("express");
const router = express.Router();

const { setTokenCookie } = require("../../utils/auth");
const { User } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// Middleware:
// The POST /api/users signup route will expect the body of the request to have a key of username, email, and password with the password of the user being created.
// Make a middleware called validateSignup that will check these keys and validate them:
const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("email Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage(
      "username Please provide a username with at least 4 characters."
    ),
  check("username")
    .not()
    .isEmail()
    .withMessage("username Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("password Password must be 6 characters or more."),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("firstName Must include first name"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("lastName Must include last name"),
  handleValidationErrors,
];

// Sign up
// POST /api/users
// Improvements - better set this up to handle unique email constraint
router.post("/", validateSignup, async (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body;

  // Special case to handle unique email constraint
  let user;
  try {
    user = await User.signup({
      email,
      username,
      password,
      firstName,
      lastName,
    });
  } catch (err) {
    const emailErr = new Error("User already exists");
    emailErr.status = 403;
    emailErr.title = "User Signup Failed - Accound already exists";
    emailErr.errors = { email: "User with that email already exists" };
    next(emailErr);
  }

  await setTokenCookie(res, user);

  const userJSON = user.toJSON();
  delete userJSON.createdAt;
  delete userJSON.updatedAt;
  delete userJSON.username;
  userJSON.token = "";

  return res.json(userJSON);
});

module.exports = router;
