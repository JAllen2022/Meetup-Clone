// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Group } = require('../db/models');

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
    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
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
        req.user = await User.scope('currentUser').findByPk(id);
      } catch (e) {
        res.clearCookie('token');
        return next();
      }

      if (!req.user) res.clearCookie('token');

      return next();
    });
  };

  // If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = ['Authentication required'];
    err.status = 401; 
    return next(err);
};

// Check to ensure that user has proper authorization to make edits to a group
const requireUserAuth = async function ( req, _res, next) {

  const group = await Group.findByPk(req.params.groupId,{raw:true});

  // If group is not found with a valid groupId number
  if(!group){
    const err = new Error(`Group couldn't be found`);
    err.title='Invalid group number';
    err.errors=[`Group could not be found with ID inputed: ${req.params.groupId}`];
    err.status=404;
    return next(err);
  }

  // If a group organizer is not equal to the user Id
  if(group.organizerId !== req.user.id){
    const err = new Error('Forbidden');
    err.title = 'Forbidden access';
    err.errors=['Forbidden acccess'];
    err.status=403;
    return next(err);
  }

  next();

};


module.exports = { setTokenCookie, restoreUser, requireAuth, requireUserAuth};
