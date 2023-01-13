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
} = require("../../db/models");

const {
  validateReqParamEventId,
  validateEventInput,
  validateEventQueryParamInput,
} = require("../../utils/validation");
const { Op } = require("sequelize");

// GET /api/events
// Return all events
router.get("/", validateEventQueryParamInput, async (req, res, next) => {
  const { name, type, startDate } = req.query;

  // Format query for search to include req.query parameters
  const where = {};
  const query = {
    where,
    attributes: {
      exclude: ["createdAt", "updatedAt", "description", "capacity", "price"],
    },
    include: [
      {
        model: Group,
        attributes: ["id", "name", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "city", "state"],
      },
    ],
    limit: res.locals.size,
    offset: res.locals.size * (res.locals.page - 1),
  };

  // Add query parameters if they exist
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (type) where.type = res.locals.type;
  if (startDate) where.startDate = startDate;

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
      console.log("checking this ~~~~~ 1 ", attendee);
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
    console.log("check currentuser", currentUser);

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
  returnEvent.Group = group;
  returnEvent.Venue = venue;
  returnEvent.EventImages = eventImages;
  delete returnEvent.createdAt;
  delete returnEvent.updatedAt;

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
