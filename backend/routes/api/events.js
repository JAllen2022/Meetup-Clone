// backend/routes/api/events.js
const express = require('express');
const router = express.Router();

const { requireAuth, requireUserAuth, requireEventAuth } = require('../../utils/auth');
const { Event, Group, Attendance, EventImage, Venue, Membership, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, checkForInvalidEvent, validateEventInput } = require('../../utils/validation');
const { Op } = require('sequelize');

// GET /api/events
// Return all events
router.get('/', async (req,res,next)=>{

    const allEvents = await Event.findAll({
        attributes:{
            exclude:['createdAt','updatedAt','description','capacity','price']
        },
        include:[
            {
                model:Group,
                attributes:['id','name','city','state']
            },
            {
                model:Venue,
                attributes:['id','city','state']
            }
        ]
    });


    const returnArray= [];
    // Lazy load preview image for event
    for(let i=0; i<allEvents.length;i++){
        const event = allEvents[i].toJSON();
        //Lazy load each aggregate for numAttending
        const attendees = await Attendance.count({
            where:{
                eventId:event.id
            }
        })
        event.numAttending=attendees;

        // Lazy load each Image
        const eventImage = await EventImage.findOne({
            where:{
                eventId:event.id
            },
            raw:true
        })
        if(eventImage) event.previewImage=eventImage.url;
        else event.previewImage=null;

        returnArray.push(event);
        // console.log('checking my event', event)
    }


    res.json(returnArray);

})

// POST /api/events/:eventId/attendance
// Request attendance for an event specified by id
// Improvements - validations consolidate
router.post('/:eventId/attendance', requireAuth, async (req,res,next)=>{


    const targetEvent = await Event.findByPk(req.params.eventId);

    if(!targetEvent){
        const err = new Error(`Event couldn't be found`);
        err.title = 'Invalid Event';
        err.errors = [`Event couldn't be found`];
        err.status = 404;
        return next(err)
    }

    const userId = req.user.id;

    // Validate user is a member of the group, and is not a 'pending' member
    // User must be member of the group
    const currentUser = await Membership.findOne({
        where:{
            userId:userId,
            groupId:targetEvent.groupId,
            status:{
                [Op.notIn]:['pending']
            }
        }
    })

    if(!currentUser){
        const err = new Error(`Must be a member of the group to request attendance`);
        err.title = 'Invalid request';
        err.errors = [`Must be a member of the group to request attendance`];
        err.status = 403;
        return next(err)
    }

    // Check if attendance has already been requested
    const attendanceToEvent = await Attendance.findAll({
        where:{
            eventId:targetEvent.id,
            userId:userId
        }
    })

    console.log('attendance to event', attendanceToEvent)
    if(attendanceToEvent.length>0) {
        const err = new Error(`Attendance has already been requested`);
        err.title = 'Invalid request';
        err.errors = [`Attendance has already been requested`];
        err.status = 400;
        return next(err)
    }

    await Attendance.create({
        eventId:targetEvent.id,
        userId:userId,
        status:'pending'
    })

    res.json({
        userId,
        status:'pending'
    })
})

// GET /api/events/:eventId/attendees
// Get all attendees of an event specified by its id
// Improvements - rafactor validations.
router.get('/:eventId/attendees', async (req,res,next)=>{

    const targetEvent = await Event.findByPk(req.params.eventId);

    if(!targetEvent){
        const err = new Error(`Event couldn't be found`);
        err.title = 'Invalid Event';
        err.errors = [`Event couldn't be found`];
        err.status = 404;
        return next(err)
    }

    const targetEventJSON = targetEvent.toJSON();

    // Check if user is host or co-host
    const currentUser = await Membership.findOne({
        where:{
            userId:req.user.id,
            groupId:targetEventJSON.groupId
        }
    })

    let currentUserJSON;
    if(currentUser) currentUserJSON = currentUser.toJSON();

    // Build query object
    const query={
        attributes: ['id','firstName','lastName'],
        include:{
            model:Attendance,
            attributes:['status'],
            required:true,
            include:{
                model:Event,
                where:{
                    id:targetEventJSON.id
                },
                attributes:[]
            }
        }
    };


    // If user is not host or co-host, OR, currentUser is not a member of the group
    if(!currentUser || (!currentUserJSON.status ==='host' && !currentUserJSON.status === 'co-host')){
        query.include.where={
            status:{
                [Op.notIn]:['pending']
            }
        }
    }

    const attendeeList = await User.findAll(query);
    const returnObj = {Attendees:[]};

    // Object manipulation to get Attendance to show up as an object instead of an array of objects
    for(let i=0;i<attendeeList.length;i++){
        const attendee = attendeeList[i].toJSON();
        console.log('checking this ~~~~~ 1 ', attendee)
        attendee.Attendance = attendee.Attendances[0];
        delete attendee.Attendances;
        returnObj.Attendees.push(attendee);
    }


    res.json(returnObj)

})

// POST /api/events/:eventId/images
// Create and return a new image for an event specified by id
router.post('/:eventId/images', checkForInvalidEvent, requireAuth, requireEventAuth, async (req,res,next)=>{

    const { url, preview } = req.body;

    const image = await EventImage.create({
        eventId:req.params.eventId,
        url,
        preview
    })

    const checkImage = await EventImage.findByPk(image.id,{
        attributes:{
            exclude:['createdAt','updatedAt','eventId']
        }
    });

    res.json(checkImage)

});

// GET /api/events/:eventId
// Returns the details of an event specified by its id
router.get('/:eventId', checkForInvalidEvent, async (req,res,next)=>{

    const event = res.locals.event;

    // Lazy load numAttending
    const attendees = await Attendance.count({
        where:{
            eventId:event.id
        }
    })

    // Lazy load group
    const group = await event.getGroup({
        attributes: ['id','name','private','city','state']
    });

    // Lazy load Venue
    const venue = await event.getVenue({
        attributes:{
            exclude:['createdAt','updatedAt','groupId']
        }
    });

    // Lazy load associated EventImages
    const eventImages = await event.getEventImages({
        attributes: ['id','url','preview']
    });

    const returnEvent = event.toJSON();

    // Add all found attributes to returned Event object
    returnEvent.numAttending = attendees;
    returnEvent.Group = group;
    returnEvent.Venue = venue;
    returnEvent.EventImages = eventImages;

    res.json(returnEvent);

})

// PUT /api/events/:eventId
// Edit and returns an event specified by its id
    // Improvements - optimize and make validate venue less sketchy - validations in general need improvement here
router.put('/:eventId',checkForInvalidEvent, requireAuth, requireUserAuth, validateEventInput,  async (req,res,next)=>{
    // Paused until routes for Venues are added
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const foundEvent = await Event.findByPk(req.params.eventId);

    foundEvent.venueId = venueId;
    foundEvent.name = name;
    foundEvent.type = type;
    foundEvent.capacity = capacity;
    foundEvent.price = price;
    foundEvent.description = description;
    foundEvent.startDate = startDate;
    foundEvent.endDate = endDate;

    await foundEvent.save();

    const returnedEvent = await Event.findByPk(foundEvent.id,{
        attributes:{
            exclude:['createdAt','updatedAt']
        }
    })

    res.json(returnedEvent)
});

// DELETE /api/events/:eventId
router.delete('/:eventId', checkForInvalidEvent, requireAuth, requireUserAuth, async (req,res,next)=>{

    const event = await Event.findByPk(req.params.eventId);

    // console.log('CHECKING EVENT ~~~~~~~~', event)

    await event.destroy();

    res.json({
        message:'Successfully deleted'
    })
});


module.exports = router;
