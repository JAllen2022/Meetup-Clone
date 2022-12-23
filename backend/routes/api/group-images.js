// backend/routes/api/events.js
const express = require('express');
const router = express.Router();

const { requireAuth, requireUserAuth, requireEventAuth } = require('../../utils/auth');
const { GroupImage, Membership } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, validateEventInput } = require('../../utils/validation');
const { Op } = require('sequelize');

// DELETE /api/group-images/:imageId
// Delete an existing image for a group
router.delete('/:imageId', requireAuth, requireUserAuth, async (req,res,next)=>{

    const image = await GroupImage.findByPk(req.params.imageId);

    if(!image){
        const err = new Error(`Group Image couldn't be found`);
        err.title = 'Invalid Group Image';
        err.errors = [`Group Image couldn't be found`];
        err.status = 404;
        return next(err)
    }

    await image.destroy();

    res.json({
        message:'Successfully deleted',
        statusCode: 200
    })

})




module.exports = router;
