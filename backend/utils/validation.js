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

// ~~~~~~~~~~~~~~~ Req.Params - Parameter Validations ~~~~~~~~~~~~~~~~~~~~


// Validate that a group exists with given group id in req.params.groupId
validateReqParamGroupId = async (req,res,next)=>{
  const group = await Group.findByPk(req.params.groupId);

  // If group is not found with a valid groupId number
  if(!group){
      const err = new Error(`Group couldn't be found`);
      err.title='Invalid group number';
      err.errors=[`Group could not be found with ID inputed: ${req.params.groupId}`];
      err.status=404;
      return next(err);
  }

  // Pass group object along in res locals object so we don't have to request from database again
  res.locals.groupId=group.id;
  res.locals.group=group;

  next();
}

// Validate that a event exists with given event.id in req.params.eventId
validateReqParamEventId = async (req,res,next)=>{

  const event = await Event.findByPk(req.params.eventId)

  // If an event is not found with a valid eventId number
  if(!event){
    const err = new Error(`Event could not be found`);
    err.title='Invalid Event number';
    err.errors=[`Event could not be found with ID inputed: ${req.params.eventId}`];
    err.status=404;
    return next(err);
  }

  // Save event obj and groupId and pass along in a variable that can be used later
  res.locals.event=event;
  res.locals.groupId = event.groupId;

  next();
}

// Validate that a venue exists with given venue.id in req.params.venueId
validateReqParamVenueId = async (req,res,next)=>{

  // If an venue is not found with a valid venueId number
  const venue = await Venue.findByPk(req.params.venueId)
  if(!venue){
    const err = new Error(`Venue couldn't be found`);
    err.title='Invalid Venue number';
    err.errors=[`Venue could not be found with ID inputed: ${req.params.venueId}`];
    err.status=404;
    return next(err);
  }

  // Save venue obj and groupId and pass along in a variable that can be used later
  res.locals.venue=venue;
  res.locals.groupId=venue.groupId;

  next();
}


// ~~~~~~~~~~~~~~~ Req.body Input Validations ~~~~~~~~~~~~~~~~~~~~


// ~~~~~~ Create an Event Input Validations ~~~~~~

// Check Future Date value
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

// Validate that the venue in the request body exists
const validateVenue = async (req,res,next)=>{

  // Allow null values for VenueId
  if(req.body.venueId === null ) return next();

  // Find the venue by primary key
  const venue= await Venue.findByPk(req.body.venueId)

  // If venue does not exist
  if(!venue){
      const err = new Error('Venue does not exist');
      err.status=404;
      err.title='Invalid Venue Id';
      err.errors=['Invalid venue id'];
      return next(err);
  }

  // Check to make sure venue belongs to group
  if(req.params.groupId){
    if(venue.groupId != req.params.groupId){
        const err = new Error('Venue does belong to the group');
        err.status=400;
        err.title='Invalid Venue Id and Group Id';
        err.errors=['Invalid venue id'];
        return next(err);
    }
  }

  // If the venue groupId doesn't match the event groupId, then throw an error
  if(req.params.eventId){
    if(venue.groupId!=res.locals.event.groupId){
      const err = new Error('Venue does belong to the group');
      err.status=400;
      err.title='Invalid Venue Id and Group Id';
      err.errors=['Invalid venue id'];
      return next(err);
    }
  }

  next();
};

// Full list of validation middleware for Event input from Req.body
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

// ~~~~~~ Create an Venue Input Validations ~~~~~~

// Full list of validation middleware for Venue input from Req.body
const validateVenueInput = [
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


// ~~~~~~ Create a Group Input Validations ~~~~~~

// Full list of validation middleware for Group input from Req.body
const validateGroupInput = [
  check('name')
      .exists({checkFalsy:true})
      .isLength({max:60})
      .withMessage('Name must be 60 characters or less'),
  check('about')
      .exists({checkFalsy:true})
      .isLength({min:50})
      .withMessage('About must be 50 characters or more'),
  check('type')
      .exists({checkFalsy:true})
      .isIn(['Online','In person'])
      .withMessage("Type must be 'Online' or 'In person'"),
  check('private')
      .exists({checkFalsy:true})
      .isBoolean({loose:true})
      .withMessage('Private must be a boolean'),
  check('city')
      .exists({checkFalsy:true})
      .withMessage('City is required'),
  check('state')
      .exists({checkFalsy:true})
      .withMessage('State is required'),
  handleValidationErrors
];

// ~~~~~~ Create a GroupImage Input Validations ~~~~~~

// Full list of validation middleware for GroupImage input from Req.body
const validateGroupImageInput = [
  check('url')
      .exists({checkFalsy:true})
      .isURL()
      .withMessage('A valid URL is required'),
  check('preview')
      .exists({checkFalsy:true})
      .isBoolean({loose:true})
      .withMessage('Preview must be a boolean'),
  handleValidationErrors
];


module.exports = {
  handleValidationErrors,
  validateReqParamGroupId,
  validateReqParamEventId,
  validateReqParamVenueId,
  validateEventInput,
  validateGroupInput,
  validateVenueInput,
  validateGroupImageInput
};
