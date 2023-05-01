// backend/routes/api/groups.js
const express = require("express");
const router = express.Router();

const {
  requireHostAuth,
  requireAuth,
  requireUserAuth,
} = require("../../utils/auth");
const {
  Group,
  Membership,
  GroupImage,
  Venue,
  Event,
  Attendance,
  EventImage,
  sequelize,
  User,
} = require("../../db/models");

const {
  validateReqParamGroupId,
  validateGroupInput,
  validateVenueInput,
  validateEventInput,
} = require("../../utils/validation");

const { Op } = require("sequelize");

// GET /api/groups
// Get all groups
router.get("/", async (req, res, next) => {
  const { name, page } = req.query;
  const userId = req.user.id;
  const where = {};
  // Setting up pagination. Default page is zero if no page number is provided
  const pageNumber = page ? parseInt(page) : 1;
  const limit = 5;
  const offset = (pageNumber - 1) * limit;
  const include = [
    {
      model: Membership,
      attributes: [],
    },
    {
      model: GroupImage,
      attributes: [],
    },
  ];

  if (name)
    where.name = {
      [Op.like]: `%${name}%`,
    };
  console.log("checking name", name, where);
  const groups = await Group.findAndCountAll({
    attributes: {
      include: [
        [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"],
        [
          sequelize.fn(
            "COALESCE",
            sequelize.fn(
              "MAX",
              sequelize.fn("DISTINCT", sequelize.col("GroupImages.url"))
            ),
            null
          ),
          "previewImage",
        ],
      ],
      exclude: ["createdAt", "updatedAt"],
    },
    include,
    where,
    group: ["Group.id"],
    // limit,
    // offset,
  });

  // const count = groups.count.length;
  // const pageCount = Math.ceil(count / limit);

  // res.json({ Groups: groups.rows, totalPages: pageCount });
  res.json({ Groups: groups.rows });

  // const groups = await Group.findAll({
  //   include: [
  //     {
  //       model: Membership,
  //       attributes: [],
  //     },
  //   ],
  // });
  // const returnArray = [];
  // // Improvements?
  // // Not creating another returnArray and return the OG group
  // for (let i = 0; i < groups.length; i++) {
  //   const group = groups[i].toJSON();
  //   const memberCount = await Membership.count({
  //     where: {
  //       groupId: group.id,
  //     },
  //   });
  //   const previewImage = await GroupImage.findOne({
  //     where: {
  //       preview: true,
  //       groupId: group.id,
  //     },
  //   });
  //   group.numMembers = memberCount;
  //   group.previewImage = previewImage ? previewImage.url : null;
  //   returnArray.push(group);
  // }
  // res.json({ Groups: returnArray });
});

// GET /api/groups/current
// Get all groups joined or organized by the current user
router.get("/current", requireAuth, async (req, res, next) => {
  // Find all groups organized by current user
  const groups = await Group.findAll({
    include: {
      model: Membership,
      attributes: [],
      where: {
        userId: req.user.id,
      },
    },
  });

  const returnArray = [];

  // Improvements?
  // This is an N+1 operation
  // Not creating another returnArray and return the OG group
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i].toJSON();

    // Lazy load membership count
    const memberCount = await Membership.count({
      where: {
        groupId: group.id,
      },
    });

    // Lazy load group preview image. This is accounting for the fact that multiple pics may be available
    // Improvements - either limit database to only have one image per group or allow user to upload and pick from multiple
    const imageUrl = await GroupImage.findOne({
      attributes: ["url"],
      where: {
        groupId: group.id,
        preview: true,
      },
    });

    if (!imageUrl) group.previewImage = imageUrl;
    else group.previewImage = imageUrl.url;

    group.numMembers = memberCount;

    returnArray.push(group);
  }

  res.json({ Groups: returnArray });
});

// GET /api/groups/:groupId/members
// Returns the members of a group specified by its id
router.get(
  "/:groupId/members",
  validateReqParamGroupId,
  async (req, res, next) => {
    // Get Membership to check whether user is host or co-host
    const userStatus = await Membership.findOne({
      where: {
        userId: req.user.id,
        groupId: req.params.groupId,
      },
      raw: true,
    });

    const output = {};
    let where = {
      groupId: req.params.groupId,
    };

    // Check if member is host or co-host
    if (
      !userStatus ||
      !(userStatus.status === "host" || userStatus.status === "co-host")
    ) {
      where.status = {
        [Op.notIn]: ["pending"],
      };
    }

    const userArray = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Membership,
        where,
        attributes: [],
      },
    });

    const memberArray = [];

    // Lazy load each Member - Eager loading didn't have the format we wanted
    // when loading Member attributes
    for (let i = 0; i < userArray.length; i++) {
      const user = userArray[i].toJSON();

      const userMem = await Membership.findOne({
        where: {
          groupId: req.params.groupId,
          userId: user.id,
        },
        attributes: ["status"],
      });

      user.Membership = userMem;
      memberArray.push(user);
    }

    output.Members = memberArray;

    output.Members = memberArray;

    res.json(output);
  }
);

// POST /api/groups/:groupId/membership
// Request a new membership for a group specified by id
router.post(
  "/:groupId/membership",
  validateReqParamGroupId,
  requireAuth,
  async (req, res, next) => {
    // Get current membership status
    const getMemStatus = await Membership.findOne({
      where: {
        groupId: req.params.groupId,
        userId: req.user.id,
      },
    });

    // If current membership status does not exist, create one and return
    if (!getMemStatus) {
      const membership = await Membership.create({
        groupId: req.params.groupId,
        userId: req.user.id,
        status: "pending",
      });

      return res.json({
        status: "pending",
        memberId: req.user.id,
      });

      // If user already requested for membership, and status is pending, return 400 error
    } else if (getMemStatus.status == "pending") {
      return res.status(400).json({
        message: "Membership has already been requested",
        statusCode: 400,
      });
      // If user is already a member, return 400 error
    } else if (
      getMemStatus.status == "member" ||
      getMemStatus.status == "host" ||
      getMemStatus.status == "co-host"
    ) {
      return res.status(400).json({
        message: "User is already a member of the group",
        statusCode: 400,
      });
    }
  }
);

// PUT /api/groups/:groupId/membership
// Change the status of a membership for a group specified by id
// Ultimate improvement - throw authorization error immediately
router.put(
  "/:groupId/membership",
  validateReqParamGroupId,
  requireAuth,
  requireUserAuth,
  async (req, res, next) => {
    const { memberId, status } = req.body;

    const groupId = res.locals.groupId;

    // Cannot change the status to pending - pass an error if user tries to
    if (status === "pending") {
      const err = new Error(`Validation Error`);
      err.title = "Cannot change status to pending";
      err.errors = { status: `Cannot change a membership status to pending` };
      err.status = 400;
      return next(err);
    }

    // Check for memberId aka UserId
    const member = await User.findByPk(memberId, { raw: true });

    // If member is not found
    if (!member) {
      const err = new Error(`Validation Error`);
      err.title = "Member does not exist";
      err.errors = { memberId: `User couldn't be found` };
      err.status = 400;
      return next(err);
    }

    // Get membership for user we want to update
    const foundMembership = await Membership.findOne({
      where: {
        groupId: groupId,
        userId: memberId,
      },
    });

    // If no membership found, return an error
    if (!foundMembership) {
      const err = new Error(
        `Membership between the user and the group does not exist`
      );
      err.title = "Membership does not exist";
      err.errors = [`Membership could not be found with ID inputed`];
      err.status = 404;
      return next(err);
    }

    // Convert user member to JSON object
    const foundMemJSON = foundMembership.toJSON();

    // Pull current user's membership from res.locals.member object saved in the requireUserAuth
    const userMembership = res.locals.member;

    // Check to see if the user member has a status of pending and we want to change them to a member
    if (foundMemJSON.status === "pending" && status === "member") {
      // Can only make this change if the current user is a host or co-host
      if (
        userMembership.status === "host" ||
        userMembership.status === "co-host"
      ) {
        // Make the change and save to database
        foundMembership.status = "member";
        await foundMembership.save();

        // Return custom object instead of making another call to server
        return res.json({
          id: foundMembership.id,
          groupId: groupId,
          memberId: memberId,
          status: "member",
        });

        // Throw an error if the change to member is not made from a co-host or host
      } else {
        const err = new Error(
          `Not authorized to change status to member. Must be host or co-host`
        );
        err.title =
          "Not authorized to change status to member. Must be host or co-host";
        err.errors = [
          `Not authorized to change status to member. Must be host or co-host`,
        ];
        err.status = 400;
        return next(err);
      }
    }

    // Changing a member to co-host
    if (foundMemJSON.status === "member" && status === "co-host") {
      // Current user must be the host of the group
      if (userMembership.status === "host") {
        foundMembership.status = "co-host";
        await foundMembership.save();

        const checkMem = await Membership.findByPk(foundMembership.id, {
          attributes: ["id", "groupId", "status"],
        });

        const checkMemJSON = checkMem.toJSON();
        checkMemJSON.memberId = memberId;

        return res.json(checkMemJSON);

        // If user is not the host, then throw an error
      } else {
        const err = new Error(
          `Cannot change a membership status to co-host. User must be organizer/host. `
        );
        err.title =
          "Cannot change a membership status to co-host. User must be organizer/host.";
        err.errors = [
          `Cannot change a membership status to co-host. User must be organizer/host.`,
        ];
        err.status = 403;
        return next(err);
      }
    }

    // Extra error catching in case user tries to change
    res.status(400).json({
      message: `Cannot change memberId, ${memberId}, status from ${foundMemJSON.status} to ${status}`,
      statusCode: 400,
    });
  }
);

// DELETE /api/groups/:groupId/membership
// Delete a membership to a group specified by id
// Improvement - if groupId owner is host and deletes their membership - something needs to happen
// either make co-host a host, or cascade the groups to be deleted as well
router.delete(
  "/:groupId/membership",
  validateReqParamGroupId,
  requireAuth,
  async (req, res, next) => {
    const { memberId } = req.body;

    // Check that the provided memberId is a user that exists
    const targetUser = await User.findByPk(memberId);

    // If the provided memberId doesn't exist, throw an error
    if (!targetUser) {
      const err = new Error(`Validation Error`);
      err.title = "Validation Error";
      err.errors = { memberId: `User couldn't be found` };
      err.status = 400;
      return next(err);
    }

    // Target membership to delete
    const targetMem = await Membership.findOne({
      where: {
        userId: +memberId,
        groupId: req.params.groupId,
      },
    });

    // If the target membership between the group and the user doesn't exist, throw an error
    if (!targetMem) {
      const err = new Error(`Membership does not exist for this User`);
      err.status = 404;
      return next(err);
    }

    // get current user's role
    const currentUser = await Membership.findOne({
      where: {
        userId: req.user.id,
        groupId: req.params.groupId,
      },
    });

    // Convert to json to check their status
    const currUserJSON = currentUser.toJSON();
    const targetMemJSON = targetMem.toJSON();

    // If current user is host of the group, and deleting a user's membership
    if (currUserJSON.status === "host" || targetMemJSON.userId == req.user.id) {
      await targetMem.destroy();

      return res.json({
        message: "Successfully deleted membership from group",
      });
      // If the current user is not the host or the same user as the memberId, then throw an error
    } else {
      const err = new Error(`Unauthorized to delete membership`);
      err.title = "Authorization required";
      err.errors = [`Unauthorized to delete membership`];
      err.status = 403;
      return next(err);
    }
  }
);

// POST /api/groups/:groupId/events
// Creates and returns a new Event for a group specified by its id
router.post(
  "/:groupId/events",
  validateReqParamGroupId,
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

    // Create a new Event
    const newEvent = await Event.create({
      venueId,
      groupId: req.params.groupId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });

    // Add host to attendees list
    const attendee = await Attendance.create({
      eventId: newEvent.id,
      userId: req.user.id,
      status: "host",
    });

    // Remove createdAt and updatedAt from the created event to match the desired output
    const newEventJSON = newEvent.toJSON();
    delete newEventJSON.createdAt;
    delete newEventJSON.updatedAt;

    res.json(newEventJSON);
  }
);

// GET
// /api/groups/:groupId/events
router.get(
  "/:groupId/events",
  validateReqParamGroupId,
  async (req, res, next) => {
    const { past } = req.query;
    // take into account past events
    const order = [];
    const where = { groupId: req.params.groupId };

    where.startDate = {
      [Op.gt]: new Date(), // Query for dates after the current date
    };
    order.push(["startDate", "ASC"]);

    // Find all events - future
    const futureEvents = await Event.findAll({
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
        {
          model: Attendance,
          attributes: ["id"],
          required: false,
        },
        {
          model: EventImage,
          where: { preview: true },
          attributes: ["url"],
          required: false,
        },
      ],
      where,
      order,
    });

    const futureArray = futureEvents.map((event) => {
      const data = event.toJSON();
      data.numAttending =
        data.Attendances.length > 0 ? data.Attendances.length : 0;
      data.previewImage =
        data.EventImages.length > 0 ? data.EventImages[0].url : null;
      delete data.Attendances;
      delete data.EventImages;
      return data;
    });

    // Reset start date and order to get past dates
    where.startDate = {
      [Op.lt]: new Date(), // Query for dates before the current date
    };
    order[0] = [["startDate", "DESC"]];

    const pastEvents = await Event.findAll({
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
        {
          model: Attendance,
          attributes: ["id"],
          required: false,
        },
        {
          model: EventImage,
          where: { preview: true },
          attributes: ["url"],
          required: false,
        },
      ],
      where,
      order,
    });

    const pastArray = pastEvents.map((event) => {
      const data = event.toJSON();
      data.numAttending =
        data.Attendances.length > 0 ? data.Attendances.length : 0;
      data.previewImage =
        data.EventImages.length > 0 ? data.EventImages[0].url : null;
      delete data.Attendances;
      delete data.EventImages;
      return data;
    });

    // Lazy load numAttending as well as previewImage
    // for (let i = 0; i < groupEvents.length; i++) {
    //   const event = groupEvents[i].toJSON();
    //   const attendees = await Attendance.count({
    //     where: {
    //       eventId: event.id,
    //     },
    //   });

    //   event.numAttending = attendees;

    //   // Find any EventImage where preview is true
    //   const eventImage = await EventImage.findOne({
    //     where: {
    //       eventId: event.id,
    //       preview: true,
    //     },
    //     raw: true,
    //   });

    //   // If an event image is found set it equal to previewImage property. If not, set to null
    //   if (eventImage) event.previewImage = eventImage.url;
    //   else event.previewImage = null;

    //   returnArray.push(event);
    // }

    res.json({
      FutureEvents: futureArray,
      PastEvents: pastArray,
    });
  }
);

// POST /api/groups/:groupId/venues
// Create a new venue for a group specified by its id
router.post(
  "/:groupId/venues",
  validateReqParamGroupId,
  requireAuth,
  requireUserAuth,
  validateVenueInput,
  async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body;

    // Create a Venue
    const newVen = await Venue.create({
      groupId: req.params.groupId,
      address,
      city,
      state,
      lat,
      lng,
    });

    // const checkVen = await Venue.findByPk(newVen.id,{
    //     attributes:['id','groupId','address','city','state','lat','lng']
    // });
    const newVenJSON = newVen.toJSON();
    delete newVenJSON.createdAt;
    delete newVenJSON.updatedAt;

    // Return desired Venue object
    res.json(newVenJSON);
  }
);

// GET /api/:groupId/venues
// Get all venues for a group by its id
router.get(
  "/:groupId/venues",
  validateReqParamGroupId,
  requireAuth,
  requireUserAuth,
  async (req, res, next) => {
    // Find all Venues for groupId
    const venues = await Venue.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        groupId: req.params.groupId,
      },
    });

    res.json({ Venues: venues });
  }
);

// GET /api/groups/:groupId
// Returns the details of a group specified by its id.
// Improvements - create middleware to ensure group ID provided is good
router.get("/:groupId", validateReqParamGroupId, async (req, res, next) => {
  // Get group by primary key
  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: GroupImage,
        attributes: {
          exclude: ["createdAt", "updatedAt", "groupId"],
        },
      },
      {
        model: Venue,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
  });

  // Lazy load Organizer (user) information through OrganizerID
  // Improvement - can find a way to eager load this above
  const org = await group.getUser({
    attributes: ["id", "firstName", "lastName"],
    where: {
      id: group.organizerId,
    },
    raw: true,
  });
  const jsonGroup = group.toJSON();
  jsonGroup.Organizer = org;

  // Lazy Load numMembers here for numMembers key/value pair
  const memCount = await Membership.count({ where: { groupId: group.id } });
  jsonGroup.numMembers = memCount;

  res.json(jsonGroup);
});

// POST /api/groups
// Creates and returns a new group
router.post("/", requireAuth, validateGroupInput, async (req, res, next) => {
  const { name, about, type, private, city, state } = req.body;

  // Creates a new group
  const newGroup = await Group.create({
    organizerId: req.user.id,
    name,
    about,
    type,
    private,
    city,
    state,
  });

  // Creates a new membership and sets user's status to host
  const host = await Membership.create({
    userId: req.user.id,
    groupId: newGroup.id,
    status: "host",
  });

  res.status(201).json(newGroup);
});

// POST /api/groups/:groupId/images
// Add an Image to a group based on the Group's Id
router.post(
  "/:groupId/images",
  validateReqParamGroupId,
  requireAuth,
  requireHostAuth,
  async (req, res, next) => {
    const { url, preview } = req.body;
    const membership = res.locals.member;

    // Create a new GroupImage
    const newGroupImage = await GroupImage.create({
      groupId: req.params.groupId,
      url,
      preview,
    });

    const newGroupImageJSON = newGroupImage.toJSON();

    res.json({
      id: newGroupImageJSON.id,
      url: newGroupImageJSON.url,
      preview: newGroupImageJSON.preview,
    });
  }
);

// PUT /api/groups/:groupId
// Updates and returns an existing group
router.put(
  "/:groupId",
  validateReqParamGroupId,
  requireAuth,
  requireHostAuth,
  validateGroupInput,
  async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;

    // Get the group that was found in validateReqParamGroupId that was saved in res.locals obj
    const targetGroup = res.locals.group;

    targetGroup.name = name;
    targetGroup.about = about;
    targetGroup.type = type;
    targetGroup.private = private;
    targetGroup.city = city;
    targetGroup.state = state;

    const returnedGroup = await targetGroup.save();

    res.json(returnedGroup);
  }
);

// DELETE /api/groups/:groupId
// Deletes an existing group
router.delete(
  "/:groupId",
  validateReqParamGroupId,
  requireAuth,
  requireHostAuth,
  async (req, res, next) => {
    // Get the group that was found in validateReqParamGroupId that was saved in res.locals obj
    const targetGroup = res.locals.group;

    await targetGroup.destroy();

    res.json({
      message: "Successfully deleted",
      statusCode: 200,
    });
  }
);

module.exports = router;
