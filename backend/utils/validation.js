// backend/utils/validation.js
const { validationResult } = require('express-validator');
const { Group, Event, Venue } = require('../db/models');

const { check } = require('express-validator');



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
    const err = new Error(`Event couldn't be found`);
    err.status = 404;
    err.title = 'Invalid Event';
    err.errors = [`The provided eventId, ${req.params.eventId}, is invalid.`];
    return next(err);
  }

  res.locals.event=event;

  next();
}

// Validate input to create a new venue
const validateNewVenue = [
  check('address')
      .exists({checkFalsy:true})
      .withMessage('Street address is required'),
  check('city')
      .exists({checkFalsy:true})
      .withMessage('City is required'),
  check('state')
      .exists({checkFalsy:true})
      .withMessage('State is required'),
  check('lat')
      .exists({checkFalsy:true})
      .isDecimal()
      .withMessage('Latitude is not valid'),
  check('lng')
      .exists({checkFalsy:true})
      .isDecimal()
      .withMessage('Longitude is not valid'),
  handleValidationErrors
];

const validateVenue = async (req,res,next)=>{

  if(req.body.venueId === null ) return next();

  const venue= await Venue.findByPk(req.body.venueId)
  // Check to make sure venue exists
  if(!venue){
      const err = new Error('Venue does not exist');
      err.status=404;
      err.title='Invalid Venue Id';
      err.errors=['Invalid venue id'];
      return next(err);
  }

  // Check to make sure venue belongs to group
  if(venue.groupId != req.params.groupId){
      const err = new Error('Venue does belong to the group');
      err.status=400;
      err.title='Invalid Venue Id and Group Id';
      err.errors=['Invalid venue id'];
      return next(err);
  }

  next();
};
// Values to validate values to create an event
// Need to check that venue exists
const validateFutureDate = (req,res,next)=>{
  const { startDate, endDate } = req.body;

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  if(startDateObj > endDateObj){
      const err = new Error('End date is less than start date');
      err.status=400;
      err.title='End date is less than start date';
      err.errors=['Invalid end date'];
      return next(err);
  }

  next();
};

const validateEventInput=[
  validateVenue,
  check('name')
      .exists({checkFalsy:true})
      .isLength({min:5})
      .withMessage('Name must be at least 5 characters'),
  check('type')
      .exists({checkFalsy:true})
      .isIn(['Online','In person'])
      .withMessage('Type must be Online or In person'),
  check('capacity')
      .exists({checkFalsy:true})
      .isInt()
      .withMessage('Capacity must be an integer'),
  check('price')
      .exists({checkFalsy:true})
      .isDecimal()
      .withMessage('Price is invalid'),
  check('description')
      .exists({checkFalsy:true})
      .withMessage('Description is required'),
  check('startDate')
      .exists({checkFalsy:true})
      .custom((value=>{
          const inputDate= new Date(value);
          const currentDate = new Date();
          if(inputDate<currentDate){
              throw new Error('Start date must be in the future')
          }
          else return true
      }))
      .withMessage('Start date must be in the future'),
  validateFutureDate,
  handleValidationErrors
];


module.exports = {
  handleValidationErrors,
  checkForInvalidGroups,
  checkForInvalidEvent,
  validateNewVenue,
  validateEventInput
};
