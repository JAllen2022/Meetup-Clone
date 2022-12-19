// backend/routes/api/groups.js
const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require ("../../utils/auth");
const { Group, User, Membership, GroupImage, Venue, sequelize} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// GET /api/groups
// Get all groups
router.get('/', async (req,res,next)=>{

    const Groups = await Group.findAll({
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
                [sequelize.fn('COUNT', sequelize.col('userId')),"numMembers"],
                [sequelize.col('url'),'previewImgage']
            ]
        },
        group:['Group.id']
    });

    res.json({Groups})

})

// GET /api/groups/current
// Get all groups joined or organized by the current user
router.get('/current', async (req,res,next)=>{

    // Requires Authentication

    // Requires User to be logged in
    // Status - 401. Message:"Authentication required"
    // if()



})



// GET /api/groups/:groupId
// Returns the details of a group specified by its id.
router.get('/:groupId', async (req,res,next)=>{

    const group = await Group.findByPk(req.params.groupId,{
        include:[
        //     {model:GroupImage},
            {
                model:User,
                // attributes:[['']]
            },
            {
                model:Venue,
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

    res.json(group)

})



module.exports = router;
