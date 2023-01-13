// backend/routes/api/events.js
const express = require("express");
const router = express.Router();

const { requireAuth, requireUserAuth } = require("../../utils/auth");

const { validateReqParamEventImageId } = require("../../utils/validation");

// DELETE /api/group-images/:imageId
// Delete an existing image for a group
router.delete(
  "/:imageId",
  validateReqParamEventImageId,
  requireAuth,
  requireUserAuth,
  async (req, res, next) => {
    const image = res.locals.eventImage;

    await image.destroy();

    res.json({
      message: "Successfully deleted",
      statusCode: 200,
    });
  }
);

module.exports = router;
