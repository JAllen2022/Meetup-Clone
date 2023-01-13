// backend/routes/api/groups.js
const express = require("express");
const router = express.Router();

const { requireAuth, requireUserAuth } = require("../../utils/auth");
const { Venue } = require("../../db/models");

const {
  validateVenueInput,
  validateReqParamVenueId,
} = require("../../utils/validation");

// PUT /api/venues/:venueId
// Edit a new venue specified by its id
router.put(
  "/:venueId",
  validateReqParamVenueId,
  requireAuth,
  requireUserAuth,
  validateVenueInput,
  async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body;

    const venue = await Venue.findByPk(req.params.venueId);

    venue.address = address;
    venue.city = city;
    venue.state = state;
    venue.lat = lat;
    venue.lng = lng;

    await venue.save();
    const venueJSON = venue.toJSON();
    delete venueJSON.createdAt;
    delete venueJSON.updatedAt;

    res.json(venueJSON);
  }
);

module.exports = router;
