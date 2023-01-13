// backend/routes/api/session.js
const express = require("express");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// validateLogin that will check these keys and validate them
// The POST /api/session login route will expect the body of the
// request to have a key of credential with either the username or email of a user and a key of password with the password of the user.
// The validateLogin middleware is composed of the check and handleValidationErrors middleware. It checks to see whether or not req.body.credential and req.body.password are empty. If one of them is empty, then an error will be returned as the response.
const validateLogin = [
  check("email")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("email Email is required"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("password Password is required"),
  handleValidationErrors,
];

// ~~~~~~~~~~~~~~~ Routes ~~~~~~~~~~~~~~~~~~~~~~

// Restore session user
// GET /api/session
router.get("/", restoreUser, (req, res) => {
  const { user } = req;
  if (user) {
    return res.json({
      user: user.toSafeObject(),
    });
  } else return res.json({ user: null });
});

// Log in
// POST /api/session
router.post("/", validateLogin, async (req, res, next) => {
  let { credential, password } = req.body;

  const user = await User.login({ credential, password });

  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    err.title = "Login failed";
    err.errors = ["The provided credentials were invalid."];
    return next(err);
  }

  await setTokenCookie(res, user);
  const userJSON = user.toJSON();
  delete userJSON.createdAt;
  delete userJSON.updatedAt;

  return res.json({
    user: userJSON,
  });
});

// Log out
// DELETE /api/session
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});

module.exports = router;
