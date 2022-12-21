// backend/routes/api/events.js
const express = require('express');
const router = express.Router();

const { requireAuth, requireUserAuth, requireEventAuth } = require('../../utils/auth');
const { Event, Group, Attendance, EventImage, Venue } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, checkForInvalidEvent, validateEventInput } = require('../../utils/validation');

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
router.delete('/:eventId')


module.exports = router;
