// backend/routes/api/events.js
const express = require('express');
const router = express.Router();

const { requireAuth, requireUserAuth, requireEventAuth } = require('../../utils/auth');
const { EventImage, Membership, Event, Group } = require('../../db/models');

const { check } = require('express-validator');
const { validateReqParamEventImageId } = require('../../utils/validation');
const { Op } = require('sequelize');

// DELETE /api/group-images/:imageId
// Delete an existing image for a group
router.delete('/:imageId', validateReqParamEventImageId, requireAuth, requireUserAuth, async (req,res,next)=>{

    const image = res.locals.eventImage;

    await image.destroy();

    res.json({
        message:'Successfully deleted',
        statusCode: 200
    })

})




module.exports = router;
