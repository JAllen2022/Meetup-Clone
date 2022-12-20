// backend/utils/validation.js
const { validationResult } = require('express-validator');
const { Group, Event } = require('../db/models');


// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .map((error) => `${error.msg}`);

    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    next(err);
  }
  next();
};

const checkForInvalidGroups = async (req, res, next) =>{

  const group = await Group.findByPk(req.params.groupId,{raw:true});

  if(!group){
    const err = new Error(`Group couldn't be found`);
    err.status = 404;
    err.title = 'Invalid Group';
    err.errors = [`The provided groupId, ${req.params.groupId}, is invalid.`];
    return next(err);
  }
  next();
}

const checkForInvalidEvent = async (req, res, next) =>{

  const event = await Event.findByPk(req.params.eventId,{
    attributes:{
      exclude:['createdAt','updatedAt']
    }
  });

  if(!event){
    const err = new Error(`Group couldn't be found`);
    err.status = 404;
    err.title = 'Invalid Group';
    err.errors = [`The provided groupId, ${req.params.groupId}, is invalid.`];
    return next(err);
  }

  res.locals.event=event;

  next();
}

module.exports = {
  handleValidationErrors,
  checkForInvalidGroups,
  checkForInvalidEvent
};
