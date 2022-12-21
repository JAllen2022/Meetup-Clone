// backend/routes/api/groups.js
const express = require('express');
const router = express.Router();

const { requireAuth, requireUserAuth } = require ("../../utils/auth");
const { Group, Membership, GroupImage, Venue, Event, Attendance, EventImage, sequelize} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, checkForInvalidGroups, validateNewVenue } = require('../../utils/validation');


// PUT /api/venues/:venueId
// Edit a new venue specified by its id
router.put('/:venueId', requireAuth, requireUserAuth, validateNewVenue, async (req,res,next)=>{

    const { address, city, state, lat, lng } = req.body;

    const venue = await Venue.findByPk(req.params.venueId);

    venue.address = address;
    venue.city = city;
    venue.state = state;
    venue.lat = lat;
    venue.lng = lng;

    await venue.save();

    const checkVen = await Venue.findByPk(req.params.venueId,{
        // attributes:['id','groupId','address','city','state','lat','lng']
    });

    res.json(checkVen)


})




module.exports = router;
