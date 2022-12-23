// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Group, Membership, Venue, Event } = require('../db/models');
const { Op } = require('sequelize')
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

  // Authorization to ensure that a user is logged in
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = ['Authentication required'];
    err.status = 401; 
    return next(err);
};

// Authorization for any changes that require a user to either be a 'host' or 'co-host'
// Requires that validateReqParams_____ has been called to pull the groupId from res.locals
const requireUserAuth = async function ( req, res, next) {

  const where={};
  const groupId = res.locals.groupId;
  // if(req.params.venueId){
  //   const venue = await Venue.findByPk(req.params.venueId)
  //   if(!venue){
  //     const err = new Error(`Venue couldn't be found`);
  //     err.title='Invalid Venue number';
  //     err.errors=[`Venue could not be found with ID inputed: ${req.params.venueId}`];
  //     err.status=404;
  //     return next(err);
  //   }
  //   groupId=venue.groupId;
  // }
  // if(req.params.groupId){
  //   groupId= req.params.groupId;
  // }
  // if(req.params.eventId){
  //   const event = await Event.findByPk(req.params.eventId)
  //   if(!event){
  //     const err = new Error(`Event could not be found`);
  //     err.title='Invalid Event number';
  //     err.errors=[`Event could not be found with ID inputed: ${req.params.eventId}`];
  //     err.status=404;
  //     return next(err);
  //   }
  //   groupId = event.groupId;
  // }

  // const group = await Group.findByPk(groupId,{raw:true});
  // console.log('checking group', group)
  // // If group is not found with a valid groupId number
  // if(!group){
  //   const err = new Error(`Group couldn't be found`);
  //   err.title='Invalid group number';
  //   err.errors=[`Group could not be found with ID inputed: ${req.params.groupId}`];
  //   err.status=404;
  //   return next(err);
  // }

  const membership = await Membership.findOne({
    where:{
      groupId:groupId,
      userId:req.user.id,
    },
    raw:true
  })

  // Pass membership object along for the current user
  res.locals.member = membership;

  // If a user is not a member, and is not a co-host, or host, then ability to change
  // details of a group is denied
  if( !membership || !(membership.status==='co-host' || membership.status ==='host')){
    const err = new Error('Forbidden');
    err.title = 'Forbidden access';
    err.errors=['Forbidden acccess'];
    err.status=403;
    return next(err);
  }

  next();
};

// Check to ensure that user has proper auth to add pictures to an event
const requireEventAuth = async function (req,res,next){

  const eventMembers = await Membership.findAll({
    attribute:['userId','status'],
    where:{
      status:{
        [Op.in]:['host','co-host','attendee']
      }
    },
    include:{
      model:Group,
      attributes:[],
      include:{
        model:Event,
        attributes:[],
        where:{
          id:req.params.eventId,
        }
      }
    }
  })

  for(let i=0;i<eventMembers.length;i++){
    const member = eventMembers[i].toJSON();
    if(member.id===req.user.id){
      return next();
    }
  }

  const err = new Error('Authentication required');
  err.title = 'Authentication required';
  err.errors = ['Authentication required'];
  err.status = 401; 
  return next(err);

};

// const requireUserOrHostAuth = async function (req,res,next){


//   const targetUser = await User.findByPk(memberId);

//   if(!targetUser){
//       const err = new Error(`Validation Error`);
//       err.title='Validation Error';
//       err.errors= {memberId:`User couldn't be found`}
//       err.status=400;
//       return next(err);
//   }




// };

  module.exports = { requireEventAuth, setTokenCookie, restoreUser, requireAuth, requireUserAuth};
