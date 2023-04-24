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
    userId: 12,
    status: "host",
  },
  {
    eventId: 2,
    userId: 1,
    status: "host",
  },
  {
    eventId: 3,
    userId: 5,
    status: "host",
  },
  {
    eventId: 4,
    userId: 8,
    status: "host",
  },
  {
    eventId: 4,
    userId: 1,
    status: "member",
  },
  {
    eventId: 5,
    userId: 1,
    status: "host",
  },
  {
    eventId: 5,
    userId: 8,
    status: "attending",
  },
  {
    eventId: 1,
    userId: 13,
    status: "member",
  },
  {
    eventId: 1,
    userId: 14,
    status: "attending",
  }
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
