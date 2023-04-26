// backend/routes/api/events.js
const express = require("express");
const router = express.Router();

const {
  requireAuth,
  requireUserAuth,
  requireEventAuth,
} = require("../../utils/auth");
const {
  Event,
  Group,
  Attendance,
  EventImage,
  Venue,
  Membership,
  User,
  GroupImage,
} = require("../../db/models");

const {
  validateReqParamEventId,
  validateEventInput,
  validateEventQueryParamInput,
} = require("../../utils/validation");
const { Op } = require("sequelize");

const { sequelize } = require("../../db/models");
const attendance = require("../../db/models/attendance");

// GET /api/events
// Return all events
router.get("/", validateEventQueryParamInput, async (req, res, next) => {
  const { name, type, startDate, user, page } = req.query;
  const userId = req.user.id;
  const where = {};

  console.log("do we have a name", name);
  // Setting up pagination. Default page is zero if no page number is provided
  const pageNumber = page ? parseInt(page) : 1;

  const limit = 5;
  const offset = (pageNumber - 1) * limit;

  // Setting up query with include statement here
  const include = [
    {
      model: Group,
      attributes: ["id", "name", "city", "state"],
    },
    {
      model: Venue,
      attributes: ["id", "city", "state"],
    },
    {
      model: EventImage,
      where: { preview: true },
      attributes: ["url"],
      required: false,
    },
    {
      model: Attendance,
      attributes: ["id"],
      required: false,
    },
  ];

  // Generate the query object
  const query = {
    where,
    attributes: {
      exclude: ["createdAt", "updatedAt", "description", "capacity", "price"],
    },
    include,
    group: ["Event.id"],
    order: [
      ["startDate", "ASC"], // Order by startDate in ascending order
    ],
    // limit,
    // offset,
  };

  // If URL params provided,
  if (name) where.name = { [Op.like]: `%${name}%` };
  console.log("did we add name?", where.name, name);
  if (type) where.type = res.locals.type;
  if (startDate)
    where.startDate = {
      [Op.gt]: startDate, // Query for dates after the current date
    };
  else
    where.startDate = {
      [Op.gt]: new Date(), // Query for dates after the current date
    };
  // If we are searching from the user page
  if (user) {
    include[0].include = {
      model: Membership,
      where: { userId },
      attributes: [],
    };
    delete query.limit;
    delete query.offset;
  }

  const allEvents = await Event.findAndCountAll(query);
  const count = allEvents.count.length;
  const events = allEvents.rows;
  const pageCount = Math.ceil(count / limit);

  let returnArray = [];

  // Iterate through and replace Attendance and EventImage arrays with variable names we expect on the front end
  if (events.length)
    returnArray = events.map((event) => {
      const data = event.toJSON();
      data.numAttending =
        data.Attendances.length > 0 ? data.Attendances.length : 0;
      data.previewImage =
        data.EventImages.length > 0 ? data.EventImages[0].url : null;
      delete data.Attendances;
      delete data.EventImages;
      return data;
    });

  res.json({
    Events: returnArray,
    // totalPages: pageCount,
  });
});

// GET /api/events/current
// Return all events that the user has joined or organized
router.get("/current", requireAuth, async (req, res, next) => {
  // Format query for search to include req.query parameters
  const { tab } = req.query;

  const include = [
    {
      model: Attendance,
      attributes: ["status"],
      where: {
        userId: req.user.id,
      },
    },
    {
      model: Group,
      attributes: ["id", "name", "city", "state"],
    },
    {
      model: Venue,
      attributes: ["id", "city", "state"],
    },
  ];

  const where = {};
  const order = [];
  if (tab === "attending" || tab === "hosting") {
    where.startDate = {
      [Op.gt]: new Date(), // Query for dates after the current date
    };
    order.push(["startDate", "ASC"]); // Order by startDate in ascending order
    if (tab === "hosting") {
      include[0].where.status = "host";
    }
  } else {
    where.startDate = {
      [Op.lt]: new Date(), // Query for dates before the current date
    };
    order.push(["startDate", "DESC"]); // Order by startDate in ascending order
  }

  const allEvents = await Event.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt", "description", "capacity", "price"],
    },
    include,
    order,
    where,
  });

  const returnArray = [];
  // Lazy load preview image for event
  for (let i = 0; i < allEvents.length; i++) {
    const event = allEvents[i].toJSON();
    //Lazy load each aggregate for numAttending
    const attendees = await Attendance.count({
      where: {
        eventId: event.id,
      },
    });
    event.numAttending = attendees;

    // Lazy load each Image
    const eventImage = await EventImage.findOne({
      where: {
        eventId: event.id,
        preview: true,
      },
      raw: true,
    });
    if (eventImage) event.previewImage = eventImage.url;
    else event.previewImage = null;

    returnArray.push(event);
  }

  res.json({ Events: returnArray });
});

// GET /api/events/upcoming
// Return all events for groups that the user has joined, sorted by date
// Includes pagination. Also takes into consideration that date ranges may change
router.get("/upcoming", requireAuth, async (req, res, next) => {
  // Format query for search to include req.query parameters
  const { startDate } = req.query;

  const where = {};

  // Either get the events from the startDate given, OR, default to today's start date
  if (startDate) where.startDate = startDate;
  else where.startDate = new Date.now();

  const query = {
    where,
    attributes: {
      exclude: ["createdAt", "updatedAt", "description", "capacity", "price"],
    },
    include: [
      {
        model: Attendance,
        attributes: [],
        where: {
          userId: req.user.id,
        },
      },
      {
        model: Group,
        attributes: ["id", "name", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "city", "state"],
      },
    ],
    order: [["startDate", "ASC"]],
  };

  const allEvents = await Event.findAll(query);

  const returnArray = [];
  // Lazy load preview image for event
  for (let i = 0; i < allEvents.length; i++) {
    const event = allEvents[i].toJSON();
    //Lazy load each aggregate for numAttending
    const attendees = await Attendance.count({
      where: {
        eventId: event.id,
      },
    });
    event.numAttending = attendees;

    // Lazy load each Image
    const eventImage = await EventImage.findOne({
      where: {
        eventId: event.id,
        preview: true,
      },
      raw: true,
    });
    if (eventImage) event.previewImage = eventImage.url;
    else event.previewImage = null;

    returnArray.push(event);
  }

  res.json({ Events: returnArray });
});

// GET /api/events/:eventId/attendees
// Get all attendees of an event specified by its id
// Improvements - rafactor validations.
router.get(
  "/:eventId/attendees",
  validateReqParamEventId,
  async (req, res, next) => {
    const targetEvent = res.locals.event;
    const targetEventJSON = targetEvent.toJSON();

    // Get membership status to see if the user is host or a member
    const currentUser = await Membership.findOne({
      where: {
        userId: req.user.id,
        groupId: targetEventJSON.groupId,
      },
    });

    let currentUserJSON;
    if (currentUser) currentUserJSON = currentUser.toJSON();

    // Build query object
    const query = {
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Attendance,
        attributes: ["status"],
        required: true,
        include: {
          model: Event,
          where: {
            id: targetEventJSON.id,
          },
          attributes: [],
        },
      },
    };

    // If user is not host or co-host
    if (
      !currentUser ||
      !(
        currentUserJSON.status === "host" ||
        currentUserJSON.status === "co-host"
      )
    ) {
      query.include.where = {
        status: {
          [Op.notIn]: ["pending"],
        },
      };
    }

    // Make query to find the attendees
    const attendeeList = await User.findAll(query);

    // Structure the object to be returned
    const returnObj = {
      Attendees: [],
    };

    // Object manipulation to get Attendance to show up as an object instead of an array of objects
    for (let i = 0; i < attendeeList.length; i++) {
      const attendee = attendeeList[i].toJSON();
      //   console.log("checking this ~~~~~ 1 ", attendee);
      attendee.Attendance = attendee.Attendances[0];
      delete attendee.Attendances;
      returnObj.Attendees.push(attendee);
    }

    res.json(returnObj);
  }
);

// POST /api/events/:eventId/attendance
// Request attendance for an event specified by id
// Improvements - validations consolidate
router.post(
  "/:eventId/attendance",
  validateReqParamEventId,
  requireAuth,
  async (req, res, next) => {
    const targetEvent = res.locals.event;
    const groupId = res.locals.groupId;

    const userId = req.user.id;

    // Validate user is a member of the group, and is not a 'pending' member
    // User must be member of the group
    const currentUser = await Membership.findOne({
      where: {
        userId: userId,
        groupId: groupId,
        status: {
          [Op.notIn]: ["pending"],
        },
      },
    });

    // If the current user is not a member of the group, i.e. is not 'pending', then throw an error
    if (!currentUser) {
      const err = new Error(
        `Must be a member of the group to request attendance`
      );
      err.title = "Invalid request";
      err.errors = [`Must be a member of the group to request attendance`];
      err.status = 403;
      return next(err);
    }
    // console.log("check currentuser", currentUser);

    // Check if attendance has already been requested
    const attendanceToEvent = await Attendance.findAll({
      where: {
        eventId: targetEvent.id,
        userId: userId,
      },
    });

    const attendanceLog = attendanceToEvent[0];

    if (attendanceLog) {
      if (
        attendanceLog.status === "member" ||
        attendanceLog.status === "attending"
      ) {
        const err = new Error("User is already an attendee of the event");
        err.status = 400;
        next(err);
      }
    }

    // If array is not empty, than attendance already requested
    if (attendanceToEvent.length > 0) {
      const err = new Error(`Attendance has already been requested`);
      err.title = "Invalid request";
      err.errors = [`Attendance has already been requested`];
      err.status = 400;
      return next(err);
    }

    await Attendance.create({
      eventId: targetEvent.id,
      userId: userId,
      status: "pending",
    });

    res.json({
      userId,
      status: "pending",
    });
  }
);

// PUT /api/events/:eventId/attendance
// Change the status of an attendance for an event specified by id
// Improvements
// Make sure that inputs for status either, attending, or member
// Only delete a valid user from userId input
// Move up my authentication for users - right now it's at the end
router.put(
  "/:eventId/attendance",
  validateReqParamEventId,
  requireAuth,
  requireUserAuth,
  async (req, res, next) => {
    const { userId, status } = req.body;

    if (status === "pending") {
      const err = new Error(`Cannot change an attendance status to pending`);
      err.title = "Invalid Change to Attendance";
      err.errors = [`Cannot change an attendance status to pending`];
      err.status = 400;
      return next(err);
    }

    const targetAttendance = await Attendance.findAll({
      where: {
        userId: userId,
        eventId: req.params.eventId,
      },
    });

    // If attendance does not exist
    if (targetAttendance < 1) {
      const err = new Error(
        `Attendance between the user and the event does not exist`
      );
      err.title = "Invalid Attendance Log";
      err.errors = [`Attendance between the user and the event does not exist`];
      err.status = 404;
      return next(err);
    }

    const attendanceLog = targetAttendance[0];

    // If changing status to 'member'
    if (status === "member") {
      // Check the membership of the target user
      const member = await Membership.findOne({
        where: {
          groupId: res.locals.groupId,
          userId: userId,
        },
      });

      // If the membership of the target user doesn't exist, or they aren't the co-host or host of the group, then throw error
      if (
        !member ||
        !(member.status === "co-host" || member.status === "host")
      ) {
        const err = new Error(
          `Cannot change status to 'member' if user is not host or co-host`
        );
        err.title = "Invalid User Status";
        err.errors = [
          `Cannot change status to 'member' if user is not host or co-host`,
        ];
        err.status = 403;
        return next(err);
      }

      // Update status to member
      attendanceLog.status = status;
    }
    // If just changing status to attending, then set status
    if (status === "attending") attendanceLog.status = status;

    await attendanceLog.save();

    const attendanceLogJSON = attendanceLog.toJSON();
    delete attendanceLogJSON.createdAt;
    delete attendanceLogJSON.updatedAt;

    res.json(attendanceLogJSON);
  }
);

// DELETE /api/events/:eventId/attendance
// Delete an attendance to an event specified by id
// Improvements - consolidate validations
router.delete(
  "/:eventId/attendance",
  validateReqParamEventId,
  requireAuth,
  async (req, res, next) => {
    const { userId } = req.body;

    const targetEvent = res.locals.event;

    // Check membership for the target user
    const membershipCheck = await Membership.findOne({
      where: {
        groupId: targetEvent.groupId,
        userId: req.user.id,
      },
    });

    // Get the attendance for the user
    const attendance = await Attendance.findOne({
      where: {
        userId: userId,
        eventId: req.params.eventId,
      },
    });

    // If not attendance relationship between target user and event, throw error
    if (!attendance) {
      const err = new Error(`Attendance does not exist for this User`);
      err.title = "Invalid Attendance";
      err.errors = [`Attendance does not exist for this User`];
      err.status = 404;
      return next(err);
    } else if (!membershipCheck) {
      const err = new Error(
        `Only the User or organizer may delete an Attendance`
      );
      err.title = "Invalid Permissions";
      err.errors = [`Only the User or organizer may delete an Attendance`];
      err.status = 403;
      return next(err);
    }

    // If the target userId is equal to the current user id, OR, the current user is co-host or host, allow change
    if (userId === req.user.id || membershipCheck.status === "host") {
      await attendance.destroy();

      res.json({
        message: "Successfully deleted attendance from event",
      });
      // If the user is not any of the above, throw an error
    } else {
      const err = new Error(
        `Only the User or organizer may delete an Attendance`
      );
      err.title = "Invalid Permissions";
      err.errors = [`Only the User or organizer may delete an Attendance`];
      err.status = 403;
      return next(err);
    }
  }
);

// POST /api/events/:eventId/images
// Create and return a new image for an event specified by id
router.post(
  "/:eventId/images",
  validateReqParamEventId,
  requireAuth,
  requireEventAuth,
  async (req, res, next) => {
    const { url, preview } = req.body;

    const image = await EventImage.create({
      eventId: req.params.eventId,
      url,
      preview,
    });

    const imageJSON = image.toJSON();
    delete imageJSON.createdAt;
    delete imageJSON.updatedAt;
    delete imageJSON.eventId;

    res.json(imageJSON);
  }
);

// GET /api/events/:eventId
// Returns the details of an event specified by its id
router.get("/:eventId", validateReqParamEventId, async (req, res, next) => {
  const event = res.locals.event;

  // Lazy load numAttending
  const attendees = await Attendance.count({
    where: {
      eventId: event.id,
    },
  });

  // Lazy load group
  const group = await event.getGroup({
    attributes: ["id", "name", "private", "city", "state"],
  });

  // Lazy load group image
  const imageUrl = await GroupImage.findOne({
    attributes: ["url"],
    where: {
      groupId: group.id,
      preview: true,
    },
  });

  // Lazy load Venue
  const venue = await event.getVenue({
    attributes: {
      exclude: ["createdAt", "updatedAt", "groupId"],
    },
  });

  // Lazy load associated EventImages
  const eventImages = await event.getEventImages({
    attributes: ["id", "url", "preview"],
  });

  const returnEvent = event.toJSON();

  // Add all found attributes to returned Event object

  returnEvent.numAttending = attendees;
  returnEvent.Group = group.toJSON();
  returnEvent.Venue = venue;
  returnEvent.EventImages = eventImages;
  delete returnEvent.createdAt;
  delete returnEvent.updatedAt;
  if (!imageUrl) returnEvent.Group.previewImage = null;
  else returnEvent.Group.previewImage = imageUrl.url;

  res.json(returnEvent);
});

// PUT /api/events/:eventId
// Edit and returns an event specified by its id
// Improvements - optimize and make validate venue less sketchy - validations in general need improvement here
router.put(
  "/:eventId",
  validateReqParamEventId,
  requireAuth,
  requireUserAuth,
  validateEventInput,
  async (req, res, next) => {
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;

    const foundEvent = res.locals.event;

    foundEvent.venueId = venueId;
    foundEvent.name = name;
    foundEvent.type = type;
    foundEvent.capacity = capacity;
    foundEvent.price = price;
    foundEvent.description = description;
    foundEvent.startDate = startDate;
    foundEvent.endDate = endDate;

    await foundEvent.save();

    const foundEventJSON = foundEvent.toJSON();
    delete foundEventJSON.createdAt;
    delete foundEventJSON.updatedAt;

    res.json(foundEventJSON);
  }
);

// DELETE /api/events/:eventId
router.delete(
  "/:eventId",
  validateReqParamEventId,
  requireAuth,
  requireUserAuth,
  async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId);

    await event.destroy();

    res.json({
      message: "Successfully deleted",
    });
  }
);

module.exports = router;
