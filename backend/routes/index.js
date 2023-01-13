// backend/routes/index.js
const express = require("express");
const router = express.Router();

// backend/routes/index.js
// ...
const apiRouter = require("./api");

router.use("/api", apiRouter);

module.exports = router;
