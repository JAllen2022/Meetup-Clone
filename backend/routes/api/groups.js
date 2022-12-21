// backend/routes/api/groups.js
const express = require('express');
const router = express.Router();

const { requireAuth, requireUserAuth } = require ("../../utils/auth");
const { Group, Membership, GroupImage, Venue, Event, Attendance, EventImage, sequelize, User} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, checkForInvalidGroups, validateNewVenue, validateEventInput } = require('../../utils/validation');

const { Op } = require('sequelize')

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

// GET /api/groups/:groupId/members
// Returns the members of a group specified by its id
// Improvements - create middleware to ensure group ID provided is good
router.get('/:groupId/members', async (req,res,next)=>{

    const group = await Group.findByPk(req.params.groupId);
    // console.log('checking group', group)

    // If group is not found with a valid groupId number
    if(!group){
        const err = new Error(`Group couldn't be found`);
        err.title='Invalid group number';
        err.errors=[`Group could not be found with ID inputed: ${req.params.groupId}`];
        err.status=404;
        return next(err);
    }

    const userStatus = await Membership.findOne({
        where:{
            userId:req.user.id,
            groupId:req.params.groupId
        },
        raw:true
    })

    console.log('check user status', userStatus)

    const output={};

    if(userStatus.status === 'host' || userStatus.status ==='co-host'){
        // console.log("asbadsfadsfasfasdf")

        const userArray = await User.findAll({
            attributes:['id','firstName','lastName'],
            include:{
                model:Membership,
                where:{
                    groupId:req.params.groupId,
                },
                attributes:[]
            }
        })

        // console.log("123123123123123123123123")
        const memberArray=[];

        // Lazy load each Member because eager loading didn't have the format we wanted
        // when loading Member attributes
        for(let i=0;i<userArray.length;i++){
            const user = userArray[i].toJSON();
            console.log('checking this', user)
            const userMem = await Membership.findOne({
                where:{
                    groupId:req.params.groupId,
                    userId:user.id
                },
                attributes:['status']
            });
            user.Membership=userMem;
            memberArray.push(user)
        }

        output.Members=memberArray;
    } else {
        const userArray = await User.findAll({
            attributes:['id','firstName','lastName'],
            include:{
                model:Membership,
                where:{
                    groupId:req.params.groupId,
                    status:{
                        [Op.notIn]:['pending']
                    }
                },
                attributes:[]
                }
        });

        const memberArray=[];

        // Lazy load each Member because eager loading didn't have the format we wanted
        // when loading Member attributes
        for(let i=0;i<userArray.length;i++){
            const user = userArray[i].toJSON();
            console.log('checking this', user)
            const userMem = await Membership.findOne({
                where:{
                    groupId:req.params.groupId,
                    userId:user.id
                },
                attributes:['status']
            });
            user.Membership=userMem;
            memberArray.push(user)
        }

        output.Members=memberArray;
    }

    res.json(output)

});

// POST /api/groups/:groupId/membership
// Request a new membership for a group specified by id
// Improvements - create middleware to ensure group ID provided is good
router.post('/:groupId/membership', requireAuth, async (req,res,next)=>{

    const group = await Group.findByPk(req.params.groupId);
    // console.log('checking group', group)

    // If group is not found with a valid groupId number
    if(!group){
        const err = new Error(`Group couldn't be found`);
        err.title='Invalid group number';
        err.errors=[`Group could not be found with ID inputed: ${req.params.groupId}`];
        err.status=404;
        return next(err);
    }

    const getMemStatus = await Membership.findOne({
        where:{
            groupId:req.params.groupId,
            userId:req.user.id
        }
    })
    if(!getMemStatus){

        const membership = await Membership.create({
            groupId:req.params.groupId,
            userId:req.user.id,
            status:'pending'
        })

        const checkMem = await Membership.findByPk(membership.id,{
            attributes:['status'],
            raw:true
        })

        checkMem.memberId = req.user.id;

        return res.json(checkMem);

    } else if (getMemStatus.status == 'pending'){
        return res.status(400).json({
            message:'Membership has already been requested',
            statusCode:400
        })
    } else if (getMemStatus.status == 'member' || getMemStatus.status == 'host' || getMemStatus.status == 'co-host'){
        return res.status(400).json({
            message:'User is already a member of the group',
            statusCode:400
        })
    }

});

// PUT /api/groups/:groupId/membership
// Change the status of a membership for a group specified by id
// Improvements - majorly refactor so error codes aren't repeated so many times
router.put('/:groupId/membership', requireAuth, requireUserAuth, async (req,res,next)=>{

    const { memberId, status } = req.body;

    if (status==='pending'){
        const err = new Error(`Cannot change a membership status to pending`);
        err.title='Cannot change status to pending';
        err.errors=[`Cannot change a membership status to pending`];
        err.status=400;
        return next(err);
    }

    // Check for memberId aka UserId
    const member = await User.findByPk(memberId, {raw:true});

    if(!member){
        const err = new Error(`User couldn't be found`);
        err.title='Member does not exist';
        err.errors=[`Member could not be found with memberID inputed`];
        err.status=400;
        return next(err);
    }

    const foundMembership = await Membership.findOne({
        where:{
            groupId:req.params.groupId,
            userId:memberId
        }
    });

    // If no membership found, return an error
    if(!foundMembership){
        const err = new Error(`Membership between the user and the group does not exist`);
        err.title='Membership does not exist';
        err.errors=[`Membership could not be found with ID inputed`];
        err.status=404;
        return next(err);
    }

    const userMembership = await Membership.findOne({
        where:{
            groupId:req.params.groupId,
            userId: req.user.id
        },
        raw:true
    })

    const foundMemJSON = foundMembership.toJSON();
    if(foundMemJSON.status==='pending' && status ==='member'){
        if(userMembership.status ==='host' || userMembership.status ==='co-host'){
            foundMembership.status = 'member';

            await foundMembership.save();

            const checkMem = await Membership.findByPk(foundMembership.id,{
                attributes:['id','groupId','status']
            });

            checkMem.memberId = memberId;

            return res.json(checkMem)

        } else {
            const err = new Error(`Not authorized to change status to member. Must be host or co-host`);
            err.title='Not authorized to change status to member. Must be host or co-host';
            err.errors=[`Not authorized to change status to member. Must be host or co-host`];
            err.status=400;
            return next(err);
        }
    }

    if(foundMemJSON.status==='member' && status ==='co-host'){
        if(userMembership.status ==='host'){
            foundMembership.status = 'co-host';
            await foundMembership.save();

            const checkMem = await Membership.findByPk(foundMembership.id,{
                attributes:['id','groupId','status']
            });

            checkMem.memberId = memberId;

            return res.json(checkMem)

        } else {
            const err = new Error(`Cannot change a membership status to co-host. User must be organizer/host. `);
            err.title='Cannot change a membership status to co-host. User must be organizer/host.';
            err.errors=[`Cannot change a membership status to co-host. User must be organizer/host.`];
            err.status=403;
            return next(err);
        }
    }

    res.status(400).json({
        message:`Cannot change memberId, ${memberId}, status from ${foundMemJSON.status} to ${status}`
    })
})

// DELETE /api/groups/:groupId/membership
// Delete a membership to a group specified by id
// Improvement - consolidate and dry up errors
// Improvement - if groupId owner is host and deletes their membership - something needs to happen
    // either make co-host a host, or cascade the groups to be deleted as well
router.delete('/:groupId/membership', requireAuth, async(req,res,next)=>{

    const group = await Group.findByPk(req.params.groupId);
    // console.log('checking group', group)

    // If group is not found with a valid groupId number
    if(!group){
        const err = new Error(`Group couldn't be found`);
        err.title='Invalid group number';
        err.errors=[`Group could not be found with ID inputed: ${req.params.groupId}`];
        err.status=404;
        return next(err);
    }

    const { memberId } = req.body;

    const targetUser = await User.findByPk(memberId);

    if(!targetUser){
        const err = new Error(`Validation Error`);
        err.title='Validation Error';
        err.errors= {memberId:`User couldn't be found`}
        err.status=400;
        return next(err);
    }

    // Target membership to delete
    const targetMem = await Membership.findOne({
        where:{
            userId: +memberId,
            groupId:req.params.groupId
        }
    })
    console.log('Checking target mem', targetMem)

    if(!targetMem){
        const err = new Error(`Membership does not exist`);
        err.title='Membership does not exist';
        err.errors=[`Membership does not exist`];
        err.status=400;
        return next(err);
    }

    // get current user's role
    const currentUser = await Membership.findOne({
        where:{
            userId:req.user.id,
            groupId:req.params.groupId
        }
    });

    // Convert to json to check their status
    const currUserJSON = currentUser.toJSON();
    const targetMemJSON = targetMem.toJSON();
    console.log()
    console.log('Checking ~~~~~~~~~~~~~1', currUserJSON.status)
    console.log('Checking ~~~~~~~~~~~~~1', targetMemJSON.userId, req.userId)


    // If current user is host of the group, and deleting a user's membership
    if(currUserJSON.status === 'host' || targetMemJSON.userId == req.user.id){
        await targetMem.destroy();

        return res.json({
            message:'Successfully deleted membership from group'
        })
    } else {
        const err = new Error(`Unauthorized to delete membership`);
        err.title='Authorization required';
        err.errors=[`Unauthorized to delete membership`];
        err.status=403;
        return next(err);
    }


});

// POST /api/groups/:groupId/events
// Creates and returns a new Event for a group specified by its id
router.post('/:groupId/events', checkForInvalidGroups, requireAuth, requireUserAuth, validateEventInput, async(req,res,next)=>{

    // Paused until routes for Venues are added
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

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
// Improvements - create middleware to ensure group ID provided is good
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
// Improvements - move this to validate utility file
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
// Improvements - move to validate utility file
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
