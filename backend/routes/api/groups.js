// backend/routes/api/groups.js
const express = require('express');
const router = express.Router();

const { requireAuth, requireUserAuth } = require ("../../utils/auth");
const { Group, Membership, GroupImage, Venue, Event, Attendance, EventImage, sequelize} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, checkForInvalidGroups, validateNewVenue } = require('../../utils/validation');



// GET /api/groups
// Get all groups
router.get('/', async (req,res,next)=>{

    const groups = await Group.findAll({
        include:[{
            model:Membership,
            attributes:[]
        },
        {
            model:GroupImage,
            attributes:[]
        },
        ],
        attributes: {
            include:[
                // [sequelize.fn('COUNT', sequelize.col('Memberships.groupId')),"numMembers"],
                [sequelize.col('url'),'previewImgage']
            ]
        },
        // group:['Group.id']
    });
    const returnArray = [];

    // Improvements?
        // This is an N+1 operation - eager load above
        // Not creating another returnArray and return the OG group
    for(let i=0;i<groups.length;i++){
        const group = groups[i].toJSON();
        // console.log('checking group',group)
        const  memberCount = await Membership.count({
            where:{
                groupId:group.id
            }
        })
        // console.log('checking numMembers',memberCount);
        group.numMembers=memberCount;
        // console.log('checking group end', group) // this doesn't update the OG group value returned
        returnArray.push(group)
    }

    res.json({Groups:returnArray})

});

// GET /api/groups/current
// Get all groups joined or organized by the current user
    // Requires Authentication through 'requireAuth' middleware
router.get('/current', requireAuth, async (req,res,next)=>{

    // Find all groups organized by current user
    const groups = await Group.findAll({
        include:{
            model:Membership,
            attributes:[],
            where:{
                userId:req.user.id
            }
        }
    });

    const returnArray = [];

    // Improvements?
        // This is an N+1 operation
        // Not creating another returnArray and return the OG group
    for(let i=0;i<groups.length;i++){
        const group = groups[i].toJSON();
        // console.log('checking group',group)

        // Lazy load membership count
        const  memberCount = await Membership.count({
            where:{
                groupId:group.id
            }
        })

        // Lazy load group preview image. This is accounting for the fact that multiple pics may be available
        // Improvements - either limit database to only have one image per group or allow user to upload and pick from multiple
        const imageUrl = await GroupImage.findOne({
            attributes:['url'],
            where:{
                groupId:group.id
            }
        })

        if(!imageUrl) group.previewImage=imageUrl;
        else group.previewImage=imageUrl.url;
        group.numMembers=memberCount;
        // console.log('checking group',group);
        // console.log('checking group end', group) // this doesn't update the OG group value returned
        returnArray.push(group)
    }

    res.json({Groups:returnArray})
});



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
const validateEvent=[
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

// POST /api/groups/:groupId/events
// Creates and returns a new Event for a group specified by its id
router.post('/:groupId/events', checkForInvalidGroups, requireAuth, requireUserAuth, validateEvent, async(req,res,next)=>{

    // Paused until routes for Venues are added
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    console.log('checking we made it here')
    console.log(req.params.groupId, venueId, name, type, capacity, price, description, startDate, endDate)

    const newEvent = await Event.create({
        venueId,
        groupId:req.params.groupId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    })

    const returnedEvent = await Event.findByPk(newEvent.id,{
        attributes:{
            exclude:['createdAt','updatedAt']
        }
    })

    res.json(returnedEvent)

});

// GET
// /api/groups/:groupId/events
router.get('/:groupId/events', checkForInvalidGroups, async (req,res,next)=>{

    const groupEvents = await Event.findAll({
        attributes:{
            exclude:['createdAt','updatedAt','description','capacity','price']
        },
        where:{
            groupId:req.params.groupId
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

    })

    const returnArray = [];

    // Lazy load numAttending as well as previewImage
    for(let i=0; i<groupEvents.length; i++){
        const event = groupEvents[i].toJSON();
        // console.log('Checking event: ',event)
        const attendees = await Attendance.count({
            where:{
                eventId:event.id
            }
        })

        event.numAttending=attendees;
        const eventImage = await EventImage.findOne({
            where:{
                eventId:event.id
            },
            raw:true
        })

        if(eventImage) event.previewImage=eventImage.url;
        else event.previewImage=eventImage;
        // console.log('checking event end')

        returnArray.push(event);
    }

    res.json(returnArray);

});

// POST /api/groups/:groupId/venues
// Create a new venue for a group specified by its id
router.post('/:groupId/venues', requireAuth, requireUserAuth, validateNewVenue, async (req,res,next)=>{

    const { address, city, state, lat, lng } = req.body;

    const newVen = await Venue.create({
        groupId:req.params.groupId,
        address,
        city,
        state,
        lat,
        lng
    })

    const checkVen = await Venue.findByPk(newVen.id,{
        attributes:['id','groupId','address','city','state','lat','lng']
    });

    res.json(checkVen)
});

// GET /api/:groupId/venues
// Get all venues for a group by its id
router.get('/:groupId/venues', checkForInvalidGroups, async (req,res,next)=>{

    const venues = await Venue.findAll({
        attributes:{
            exclude:['createdAt','updatedAt']
        },
        where:{
            groupId:req.params.groupId
        }
    })

    res.json({Venues:venues})
})

// GET /api/groups/:groupId
// Returns the details of a group specified by its id.
router.get('/:groupId', async (req,res,next)=>{

    const group = await Group.findByPk(req.params.groupId,{
        include:[
            {
                model:GroupImage,
                // Default scope take care of this. Uncomment/remove later if necessary
                // attributes:{
                //     exclude:['groupId','createdAt','updatedAt']
                // }

            },
            // Improvement - if we can eager load this and change the variable name here
            // instead of having User class
            // {
                //     model:User,
                //     attributes:['id','firstName','lastName']

                // },
                {
                    model: Venue,
                    attributes:{
                        exclude:['createdAt','updatedAt']
                    }
                }
            ]
        })

        // If a group isn't found, create an error, and call next
        if(!group){
            const err = new Error(`Group couldn't be found`);
            err.status = 404;
            err.title = 'Invalid Group';
            err.errors = [`The provided groupId, ${req.params.groupId}, is invalid.`];
            return next(err);
        }

        // Lazy load Organizer (user) information through OrganizerID
        // Improvement - can find a way to eager load this above
        const org = await group.getUser({
            attributes:['id','firstName','lastName'],
            where:{
                id:group.organizerId
            },
            raw:true
        })
        const jsonGroup = group.toJSON();
        jsonGroup.Organizer= org;
        // console.log(jsonGroup)

        // Lazy Load numMembers here for numMembers key/value pair
        const memCount = await Membership.count({ where: {groupId:group.id}})
        jsonGroup.numMembers=memCount;

        res.json(jsonGroup)

});

// Use check method to build middleware to ensure input to create a group is valid
const validateGroup = [
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

// POST /api/groups
// Creates and returns a new group
router.post('/', requireAuth, validateGroup, async (req,res,next)=>{

    const { name, about, type, private, city, state } = req.body;

    // Creates a new group
    const newGroup = await Group.create({
        organizerId:req.user.id,
        name,
        about,
        type,
        private,
        city,
        state
    });

    // Creates a new membership and sets user's status to host
    const host = await Membership.create({
        userId:req.user.id,
        groupId:newGroup.id,
        status:'host'
    })

    // console.log('checking host', host)

    res.json(newGroup)

});

// Validate Group Image input is valid for POST route below
const validateGroupImage = [
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

// POST /api/groups/:groupId/images
// Add an Image to a group based on the Group's Id
router.post('/:groupId/images', requireAuth, requireUserAuth, validateGroupImage, async(req,res,next)=>{ // requireUserAuth

    // Error handled in requireUserAuth if :groupId is invalid

    const { url, preview } = req.body;

    const newGroupImage = await GroupImage.create({
        groupId:req.params.groupId,
        url,
        preview
    });

    // Improvement - remove this and somehow exclude createdAt, updatedAt, and GroupId on creation of GroupImage above
    const returnNewImage = await GroupImage.findByPk(newGroupImage.id)

    res.json(returnNewImage)

});

// PUT /api/groups/:groupId
// Updates and returns an existing group
router.put('/:groupId', requireAuth, requireUserAuth, validateGroup, async (req,res,next)=>{ // requireUserAuth

    const { name, about, type, private, city, state } = req.body;

    const getGroup = await Group.findByPk(req.params.groupId);

    getGroup.name = name;
    getGroup.about = about;
    getGroup.type = type;
    getGroup.private = private;
    getGroup.city = city;
    getGroup.state = state;

    const returnedGroup = await getGroup.save();

    res.json(returnedGroup)

});

// DELETE /api/groups/:groupId
// Deletes an existing group
router.delete('/:groupId', requireAuth, requireUserAuth, async (req,res,next)=>{

    // Invalid group numbers handled in requireUserAuth
    const deleteGroup = await Group.findByPk(req.params.groupId);
    // console.log('delete this group',deleteGroup)

    await deleteGroup.destroy();

    res.json({
        message:'Successfully deleted'
    })

});



module.exports = router;
