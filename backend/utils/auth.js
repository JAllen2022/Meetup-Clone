// backend/utils/auth.js
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User, Membership, Attendance } = require("../db/models");
const { Op } = require("sequelize");
const { secret, expiresIn } = jwtConfig;

// backend/utils/auth.js
// ...

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const token = jwt.sign(
    { data: user.toSafeObject() },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie("token", token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.scope("currentUser").findByPk(id);
    } catch (e) {
      res.clearCookie("token");
      return next();
    }

    if (!req.user) res.clearCookie("token");

    return next();
  });
};

// Authorization to ensure that a user is logged in
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error("Authentication required");
  err.title = "Authentication required";
  err.errors = ["Authentication required"];
  err.status = 401;
  return next(err);
};

// Authorization for any changes that require a user to either be a 'host' or 'co-host'
// Requires that validateReqParams_____ has been called to pull the groupId from res.locals
const requireUserAuth = async function (req, res, next) {
  const where = {};
  const groupId = res.locals.groupId;

  const membership = await Membership.findOne({
    where: {
      groupId: groupId,
      userId: req.user.id,
    },
    raw: true,
  });

  // Pass membership object along for the current user
  res.locals.member = membership;

  // If a user is not a member, and is not a co-host, or host, then ability to change
  // details of a group is denied
  if (
    !membership ||
    !(membership.status === "co-host" || membership.status === "host")
  ) {
    const err = new Error("Forbidden");
    err.title = "Forbidden access";
    err.errors = ["Forbidden acccess"];
    err.status = 403;
    return next(err);
  }

  next();
};

// Authorization requiring ONLY host to make changes
const requireHostAuth = async function (req, res, next) {
  const where = {};
  const groupId = res.locals.groupId;

  const membership = await Membership.findOne({
    where: {
      groupId: groupId,
      userId: req.user.id,
    },
    raw: true,
  });

  // Pass membership object along for the current user
  res.locals.member = membership;

  // If a user is not a member, and is not a co-host, or host, then ability to change
  // details of a group is denied
  if (!membership || !(membership.status === "host")) {
    const err = new Error("Forbidden");
    err.title = "Forbidden access";
    err.errors = ["Forbidden acccess"];
    err.status = 403;
    return next(err);
  }

  next();
};

// Check to ensure that user has proper auth to add pictures to an event
const requireEventAuth = async function (req, res, next) {
  const checkAttendance = await Attendance.findAll({
    where: {
      userId: req.user.id,
      eventId: req.params.eventId,
      status: {
        [Op.in]: ["host", "member", "attending"],
      },
    },
  });

  if (!checkAttendance || checkAttendance.length < 1) {
    const err = new Error("Authentication required");
    err.title = "Authentication required";
    err.errors = ["Authentication required"];
    err.status = 401;
    return next(err);
  }

  next();
};

module.exports = {
  requireHostAuth,
  requireEventAuth,
  setTokenCookie,
  restoreUser,
  requireAuth,
  requireUserAuth,
};
