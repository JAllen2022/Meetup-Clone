// backend/utils/validation.js
const { validationResult } = require("express-validator");
const {
  Group,
  Event,
  Venue,
  GroupImage,
  EventImage,
  Attendance,
} = require("../db/models");

const { check } = require("express-validator");

// ~~~~~~~~~~~~~~~ Validation Error Compilers ~~~~~~~~~~~~~~~~~~~~

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => `${error.msg}`);

    const newErr = {};
    errors.forEach((e) => {
      const obj = e.split(" ");
      const objkey = obj[0].toLowerCase();
      obj.shift();
      newErr[objkey] = obj.join(" ");
    });

    if (newErr.invalid) {
      delete newErr.invalid;
    }

    const err = new Error("Validation Error");
    err.errors = newErr;
    err.status = 400;
    err.title = "Validation Error";
    next(err);
  }
  next();
};

// Custom Error Compiler
const customValidationErrorCompiler = (req, rex, next) => {
  const checkErrors = Object.keys(req.errorObj);
  console.log('the request', req)
  if (checkErrors.length > 0) {
    const err = Error("Validation Error");
    err.errors = req.errorObj;
    err.status = 400;
    err.title = "Validation Error";
    next(err);
  }
  next();
};

// ~~~~~~~~~~~~~~~ Req.Params - Parameter Validations ~~~~~~~~~~~~~~~~~~~~

// Validate that a group exists with given group id in req.params.groupId
validateReqParamGroupId = async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId);

  // If group is not found with a valid groupId number
  if (!group) {
    const err = new Error(`Group couldn't be found`);
    err.title = "Invalid group number";
    err.errors = [
      `Group could not be found with ID inputed: ${req.params.groupId}`,
    ];
    err.status = 404;
    return next(err);
  }

  // Pass group object along in res locals object so we don't have to request from database again
  res.locals.groupId = group.id;
  res.locals.group = group;

  next();
};

// Validate that a event exists with given event.id in req.params.eventId
validateReqParamEventId = async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId);

  // If an event is not found with a valid eventId number
  if (!event) {
    const err = new Error(`Event could not be found`);
    err.title = "Invalid Event number";
    err.errors = [
      `Event could not be found with ID inputed: ${req.params.eventId}`,
    ];
    err.status = 404;
    return next(err);
  }

  // Save event obj and groupId and pass along in a variable that can be used later
  res.locals.event = event;
  res.locals.groupId = event.groupId;

  next();
};

// Validate that a venue exists with given venue.id in req.params.venueId
validateReqParamVenueId = async (req, res, next) => {
  // If an venue is not found with a valid venueId number
  const venue = await Venue.findByPk(req.params.venueId);
  if (!venue) {
    const err = new Error(`Venue couldn't be found`);
    err.title = "Invalid Venue number";
    err.errors = [
      `Venue could not be found with ID inputed: ${req.params.venueId}`,
    ];
    err.status = 404;
    return next(err);
  }

  // Save venue obj and groupId and pass along in a variable that can be used later
  res.locals.venue = venue;
  res.locals.groupId = venue.groupId;

  next();
};

// Validate that a group image exists with given groupimage.id in req.params.imageId
validateReqParamGroupImageId = async (req, res, next) => {
  const image = await GroupImage.findByPk(req.params.imageId);

  // If an group image is not found with a valid imageId number
  if (!image) {
    const err = new Error(`Group Image couldn't be found`);
    err.title = "Invalid Group Image";
    err.errors = [`Group Image couldn't be found`];
    err.status = 404;
    return next(err);
  }

  // Save group image obj and groupId and pass along in a variable that can be used later
  res.locals.groupId = image.groupId;
  res.locals.image = image;

  next();
};

// Validate that a event image exists with given eventimage.id in req.params.imageId
validateReqParamEventImageId = async (req, res, next) => {
  const image = await EventImage.findByPk(req.params.imageId);

  // If an event image is not found with a valid imageId number
  if (!image) {
    const err = new Error(`Event Image couldn't be found`);
    err.title = "Invalid Event Image";
    err.errors = [`Event Image couldn't be found`];
    err.status = 404;
    return next(err);
  }

  const event = await Event.findByPk(image.eventId);

  // Save image obj and groupId and pass along in a variable that can be used later
  res.locals.groupId = event.groupId;
  res.locals.eventImage = image;

  next();
};

// ~~~~~~~~~~~~~~~ Req.body Input Validations ~~~~~~~~~~~~~~~~~~~~

// ~~~~~~ Create an Event Input Validations ~~~~~~

// Validate that the venue in the request body exists
const validateVenue = async (req, res, next) => {
  // Allow null values for VenueId
  if (req.body.venueId === null) return next();

  // Find the venue by primary key
  const venue = await Venue.findByPk(req.body.venueId);

  // If venue does not exist
  if (!venue) {
    if (req.method === "PUT") {
      const err = new Error(`Venue couldn't be found`);
      err.title = "Invalid Venue";
      err.errors = [`Venue couldn't be found`];
      err.status = 404;
      return next(err);
    }
    req.errorObj.venueId = "Venue does not exist";
    return next();
  }

  // Check to make sure venue belongs to group
  if (req.params.groupId) {
    if (venue.groupId != req.params.groupId) {
      req.errorObj.venueId = "Venue does not belong to the group";
      return next();
    }
  }

  // If the venue groupId doesn't match the event groupId, then throw an error
  if (req.params.eventId) {
    if (venue.groupId != res.locals.event.groupId) {
      req.errorObj.venueId = "Venue does not belong to the group";
      return next();
    }
  }

  next();
};

// Full list of validation middleware for Event input from Req.body
const validateEventInput = [
  validateVenue,
  (req, res, next) => {
    const { name } = req.body;
    if (!name || name.length < 5) {
      req.errorObj.name = "Name must be at least 5 characters";
      return next();
    }
    next();
  },
  (req, res, next) => {
    const { type } = req.body;
    if (!type || !(type === "Online" || type === "In Person")) {
      req.errorObj.type = "Type must be Online or In person";
      return next();
    }
    next();
  },
  (req, res, next) => {
    const { capacity } = req.body;
    if (!capacity || isNaN(capacity)) {
      req.errorObj.capacity = "Capacity must be an integer";
      return next();
    }
    next();
  },
  (req, res, next) => {
    const { price } = req.body;
    if (!price || isNaN(price)) {
      req.errorObj.price = "Price is invalid";
      return next();
    }
    next();
  },
  (req, res, next) => {
    const { description } = req.body;
    if (!description) {
      req.errorObj.description = "Description is required";
      return next();
    }
    next();
  },
  (req, res, next) => {
    const { startDate } = req.body;
    const inputDate = new Date(startDate);
    const currentDate = new Date();
    if (inputDate.toString() === "Invalid Date") {
      req.errorObj.startDate = "Invalid Start Date";
      return next();
    }
    if (inputDate < currentDate) {
      req.errorObj.startDate = "Start date must be in the future";
      return next();
    }
    next();
  },
  // Check Future Date value
  (req, res, next) => {
    const { startDate, endDate } = req.body;

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (endDateObj.toString() === "Invalid Date") {
      req.errorObj.endDate = "Invalid End Date";
      return next();
    }
    if (startDateObj > endDateObj) {
      req.errorObj.endDate = "End date must be after start date";
      return next();
    }

    next();
  },
  customValidationErrorCompiler,
];

// ~~~~~~ Create an Venue Input Validations ~~~~~~

// Full list of validation middleware for Venue input from Req.body
const validateVenueInput = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("address Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .withMessage("city City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .withMessage("state State is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({ min: -90.0, max: 90.0 })
    .withMessage("lat Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180.0, max: 180.0 })
    .withMessage("lng Longitude is not valid"),
  handleValidationErrors,
];

// ~~~~~~ Create a Group Input Validations ~~~~~~

// Full list of validation middleware for Group input from Req.body
const validateGroupInput = [
  (req, res, next) => {
    const { name } = req.body;
    if (!name) {
      req.errorObj.name = "Name is required";
      return next();
    }
    if (name.length > 60) {
      req.errorObj.name = "Name must be 60 characters or less";
      return next();
    }
    next();
  },
  (req, res, next) => {
    const { about } = req.body;
    if (!about) {
      req.errorObj.about = "About is required";
      return next();
    }
    if (about.length < 50) {
      req.errorObj.about = "About must be 50 characters or more";
      return next();
    }
    next();
  },
  (req, res, next) => {
    const { type } = req.body;
    const allowedValues = ["Online", "In person"];
    if (!type) {
      req.errorObj.type = "Type is required";
      return next();
    }
    if (!allowedValues.includes(type)) {
      req.errorObj.type = "Type must be 'Online' or 'In person'";
      return next();
    }
    next();
  },
  (req, res, next) => {
    const { private } = req.body;
    if (typeof private !== "boolean") {
      req.errorObj.private = "Private must be a boolean";
      return next();
    }
    next();
  },
  (req, res, next) => {
    const { city } = req.body;
    if (!city) {
      req.errorObj.city = "City is required";
      return next();
    }
    next();
  },
  (req, res, next) => {
    const { state } = req.body;
    if (!state) {
      req.errorObj.state = "State is required";
      return next();
    }
    next();
  },
  customValidationErrorCompiler,
];

// ~~~~~~ Create a GroupImage Input Validations ~~~~~~

// Full list of validation middleware for GroupImage input from Req.body
// This authorization is not required. Preview check below does not allow false values for some reason
const validateGroupImageInput = [
  check("url")
    .exists({ checkFalsy: true })
    .isURL()
    .withMessage("groupImage A valid URL is required"),
  check("preview")
    .exists({ checkFalsy: true })
    .isBoolean()
    .withMessage("preview Preview must be a boolean"),
  handleValidationErrors,
];

// ~~~~~~~~~~~~~~~ Req.Query Search Validations ~~~~~~~~~~~~~~~~~~~~

// Validate Event Query Parameters
const validateEventQueryParamInput = [
  (req, res, next) => {
    let page = +req.query.page;
    if (isNaN(page)) page = 1;
    if (page < 1) {
      req.errorObj.page = `Page must be greater than or equal to 1`;
      return next();
    }
    res.locals.page = page;
    next();
  },
  (req, res, next) => {
    let size = +req.query.size;
    if (isNaN(size)) size = 20;
    if (size < 1 || size > 20) {
      req.errorObj.size = `Size must be greater than or equal to 1 and less than or equal to 20`;
      return next();
    }
    res.locals.size = size;
    next();
  },
  (req, res, next) => {
    if (req.query.name) {
      const checkStringNumbers = Number(req.query.name);
      if (
        typeof checkStringNumbers === "number" &&
        !isNaN(checkStringNumbers)
      ) {
        req.errorObj.name = `Name must be a string`;
        return next();
      }
      res.locals.name = req.query.name;
      // console.log(res.locals.name);
    }

    next();
  },
  (req, res, next) => {
    const { type } = req.query;
    if (type) {
      if (!(type === "Online" || type === "In person")) {
        req.errorObj.type = `Type must be 'Online' or 'In Person`;
        return next();
      }
      res.locals.type = req.query.type;
    }

    next();
  },
  (req, res, next) => {
    const { startDate } = req.query;
    if (startDate) {
      const dateString = new Date(startDate);
      if (dateString.toString() === "Invalid Date") {
        req.errorObj.startDate = `Start date must be a valid datetime`;
        return next();
      }
      res.locals.startDate = startDate;
    }
    next();
  },
  customValidationErrorCompiler,
];

module.exports = {
  handleValidationErrors,
  customValidationErrorCompiler,
  validateReqParamGroupId,
  validateReqParamEventId,
  validateReqParamVenueId,
  validateReqParamGroupImageId,
  validateReqParamEventImageId,
  validateEventInput,
  validateGroupInput,
  validateVenueInput,
  validateGroupImageInput,
  validateEventQueryParamInput,
};
