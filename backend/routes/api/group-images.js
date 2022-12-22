// backend/routes/api/events.js
const express = require('express');
const router = express.Router();

const { requireAuth, requireUserAuth, requireEventAuth } = require('../../utils/auth');
const { GroupImage, Membership } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, checkForInvalidEvent, validateEventInput } = require('../../utils/validation');
const { Op } = require('sequelize');

// DELETE /api/group-images/:imageId
// Delete an existing image for a group
router.delete('/:imageId', requireAuth, async (req,res,next)=>{

    const image = await GroupImage.findByPk(req.params.imageId);
    // const imageJSON = image.toJSON();

    if(!image){
        const err = new Error(`Group Image couldn't be found`);
        err.title = 'Invalid Group Image';
        err.errors = [`Group Image couldn't be found`];
        err.status = 404;
        return next(err)
    }
    // console.log('checking image ~~~~~~`', imageJSON, imageJSON.groupId)

    const memberCheck = await Membership.findOne({
        where:{
            userId:req.user.id,
            groupId:image.groupId
        }
    })

    if( !memberCheck || !(memberCheck.status === 'host' || memberCheck.status === 'co-host')){
        const err = new Error(`User is not authorized to perform this action`);
        err.title = 'Invalid Authorization';
        err.errors = [`User is not authorized to perform this action`];
        err.status = 403;
        return next(err)
    }

    await image.destroy();

    res.json({
        message:'Successfully deleted',
        statusCode: 200
    })

})




module.exports = router;
