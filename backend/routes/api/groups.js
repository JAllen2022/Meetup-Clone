// backend/routes/api/groups.js
const express = require('express');
const router = express.Router();

const { requireAuth, requireUserAuth } = require ("../../utils/auth");
const { Group, Membership, GroupImage, Venue, sequelize} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
        }
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
        console.log('checking group',group)
        const  memberCount = await Membership.count({
            where:{
                groupId:group.id
            }
        })
        console.log('checking numMembers',memberCount);
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

    const groups = await Group.findAll({
        // where:{
        //     organizerId:req.user.id
        // },
        include:[{
            model:Membership,
            attributes:[],
            where:{
                userId:req.user.id
            }
        },
        {
            model:GroupImage,
            attributes:[]
        }],
        attributes: {
            include:[
            //  [sequelize.fn('COUNT',sequelize(Members.groupId)), 'numMembers'] // this was causing issues - wrong count
                [sequelize.col('url'),'previewImgage']
            ]
        },
        group:['Group.id']
    });
    const returnArray = [];

    // Improvements?
        // This is an N+1 operation
        // Not creating another returnArray and return the OG group
    for(let i=0;i<groups.length;i++){
        const group = groups[i].toJSON();
        console.log('checking group',group)
        const  memberCount = await Membership.count({
            where:{
                groupId:group.id
            }
        })
        console.log('checking numMembers',memberCount);
        group.numMembers=memberCount;
        // console.log('checking group end', group) // this doesn't update the OG group value returned
        returnArray.push(group)
    }

    res.json({Groups:returnArray})
});

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

    const newGroup = await Group.create({
        organizerId:req.user.id,
        name,
        about,
        type,
        private,
        city,
        state
    });

    res.json(newGroup)

})

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
router.post('/:groupId/images', requireAuth, requireUserAuth, validateGroupImage, async(req,res,next)=>{

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
router.put('/:groupId', requireAuth, requireUserAuth, validateGroup, async (req,res,next)=>{

    const { name, about, type, private, city, state } = req.body;

    const getGroup = await Group.findByPk(req.params.groupId);

    getGroup.name = name;
    getGroup.about = about;
    getGroup.type = type;
    getGroup.private = private;
    getGroup.city = city;
    getGroup.city = state;

    const returnedGroup = await getGroup.save();

    res.json(returnedGroup)

});



module.exports = router;
