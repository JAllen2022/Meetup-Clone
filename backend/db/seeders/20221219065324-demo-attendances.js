"use strict";

const { Op } = require("sequelize");

const options = {};
options.tableName = "Attendances";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const demo_attendance = [
  {
    eventId: 1,
    userId: 2,
    status: "member",
  },
  {
    eventId: 2,
    userId: 2,
    status: "member",
  },
  {
    eventId: 3,
    userId: 3,
    status: "member",
  },
  {
    eventId: 4,
    userId: 4,
    status: "member",
  },
  {
    eventId: 5,
    userId: 5,
    status: "member",
  },
  {
    eventId: 1,
    userId: 6,
    status: "member",
  },
  {
    eventId: 2,
    userId: 8,
    status: "attending",
  },
  {
    eventId: 3,
    userId: 7,
    status: "waitlist",
  },
  {
    eventId: 4,
    userId: 7,
    status: "pending",
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, demo_attendance);
  },

  async down(queryInterface, Sequelize) {
    const attendanceUserId = demo_attendance.map((ele) => ele.userId);
    await queryInterface.bulkDelete(options, {
      userId: { [Op.in]: attendanceUserId },
    });
  },
};
