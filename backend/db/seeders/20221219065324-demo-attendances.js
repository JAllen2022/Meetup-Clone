"use strict";

const { Op } = require("sequelize");

const options = {};
options.tableName = "Attendances";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const demo_attendance = [
  // Event 1 - Treasure Island Car meetup
  // Group 1 - Club Supra
  {
    eventId: 1,
    userId: 12,
    status: "host",
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
  },
  {
    // Demo
    eventId: 1,
    userId: 1,
    status: "attending",
  },

  // Event 2 - Traders United Sunday Brunch
  // Group 2 - Stonk Traders United
  {
    eventId: 2,
    userId: 1,
    status: "host",
  },
  {
    eventId: 2,
    userId: 13,
    status: "attending",
  },
  // Event 3 - Golden Gate Park - Saturday Run
  // Group 3 - Golden Gate Bridge Running Group
  {
    eventId: 3,
    userId: 5,
    status: "host",
  },
  {
    eventId: 3,
    userId: 13,
    status: "member",
  },
  {
    eventId: 3,
    userId: 12,
    status: "attending",
  },
  // Event 4 - Golden Gate Park - Soccer Tournament
  // Group 4 - Golden Soccer Group
  {
    eventId: 4,
    userId: 1,
    status: "host",
  },
  {
    eventId: 4,
    userId: 11,
    status: "member",
  },
  {
    eventId: 4,
    userId: 8,
    status: "member",
  },
  {
    eventId: 4,
    userId: 7,
    status: "attending",
  },
  // Event 5 - Golden Gate Soccer - Tuesday Nights
  // Group 4 - Golden Soccer Group
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
  // Event 6 - The Council of Elrond
  // Group 5 - Fellowship of the Ring
  {
    // Gandalf
    userId: 2,
    eventId: 6,
    status: "host",
  },
  {
    // Gandalf
    userId: 3,
    eventId: 6,
    status: "attending",
  },
  {
    // Frodo
    userId: 4,
    eventId: 6,
    status: "attending",
  },
  {
    // Samwise
    userId: 5,
    eventId: 6,
    status: "attending",
  },
  {
    // Bilbo
    userId: 6,
    eventId: 6,
    status: "attending",
  },
  {
    // Gimli
    userId: 7,
    eventId: 6,
    status: "attending",
  },
  {
    // Boromir
    userId: 8,
    eventId: 6,
    status: "attending",
  },
  {
    // Legolas
    userId: 10,
    eventId: 6,
    status: "attending",
  },
  {
    // Merry
    userId: 16,
    eventId: 6,
    status: "attending",
  },
  {
    // Pippin
    userId: 17,
    eventId: 6,
    status: "attending",
  },
  // Event 7 - The Breaking of the Fellowship
  // Group 5 - Fellowship of the Ring
  {
    // Gandalf
    userId: 2,
    eventId: 7,
    status: "host",
  },
  {
    // Gandalf
    userId: 3,
    eventId: 7,
    status: "attending",
  },
  {
    // Frodo
    userId: 4,
    eventId: 7,
    status: "attending",
  },
  {
    // Samwise
    userId: 5,
    eventId: 7,
    status: "attending",
  },
  {
    // Bilbo
    userId: 6,
    eventId: 7,
    status: "attending",
  },
  {
    // Gimli
    userId: 7,
    eventId: 7,
    status: "attending",
  },
  {
    // Boromir
    userId: 8,
    eventId: 7,
    status: "attending",
  },
  {
    // Legolas
    userId: 10,
    eventId: 7,
    status: "attending",
  },
  {
    // Merry
    userId: 16,
    eventId: 7,
    status: "attending",
  },
  {
    // Pippin
    userId: 17,
    eventId: 7,
    status: "attending",
  },
  // Event 8 - Mine Excursion
  // Group 6 - Moria Mining Company
  {
    // Gimli
    userId: 7,
    eventId: 8,
    status: "host",
  },
  {
    // Legolas
    userId: 10,
    eventId: 8,
    status: "member",
  },
  {
    // Demo User
    userId: 1,
    eventId: 8,
    status: "attending",
  },
  // Event 9 - Mithril Trade Negotiations
  // Group 6 - Moria Mining Company
  {
    // Gimli
    userId: 7,
    eventId: 9,
    status: "host",
  },
  {
    // Legolas
    userId: 10,
    eventId: 9,
    status: "member",
  },
  // Event 10 - Ride Across the Wold
  // Group 7 - Rohan Riders Club
  {
    // Eomer
    userId: 15,
    eventId: 10,
    status: "host",
  },
  {
    // Aragorn
    userId: 2,
    eventId: 10,
    status: "attending",
  },
  {
    // Demo User
    userId: 1,
    eventId: 10,
    status: "attending",
  },
  // Event 11 - Ride Across the Wold
  // Group 7 - Rohan Riders Club
  {
    // Eomer
    userId: 15,
    eventId: 11,
    status: "host",
  },
  {
    // Demo User
    userId: 1,
    eventId: 11,
    status: "attending",
  },
  // Event 12 - Spring Planting Festival
  // Group 8 - Gondor Gardeners Society
  {
    // Eomer
    userId: 2,
    eventId: 12,
    status: "host",
  },
  {
    // Gandalf
    userId: 3,
    eventId: 12,
    status: "attending",
  },
  {
    // Demo User
    userId: 1,
    eventId: 12,
    status: "attending",
  },
  // Event 13 - Gardening Workshop: Pruning Techniques
  // Group 8 - Gondor Gardeners Society
  {
    // Eomer
    userId: 2,
    eventId: 13,
    status: "host",
  },
  {
    // Gandalf
    userId: 3,
    eventId: 13,
    status: "attending",
  },
  {
    // Demo User
    userId: 1,
    eventId: 13,
    status: "attending",
  },
  // Event 14 - Annual Industrial Expo
  // Group 9 - Isengard Industrialists Association
  {
    // Saruman
    userId: 18,
    eventId: 14,
    status: "host",
  },
  {
    // Sauron
    userId: 11,
    eventId: 14,
    status: "member",
  },
  {
    // Orc army
    userId: 19,
    eventId: 14,
    status: "attending",
  },
  // Event 15 - Workshop: Introduction to Orcish Blacksmithing
  // Group 9 - Isengard Industrialists Association
  {
    // Saruman
    userId: 18,
    eventId: 15,
    status: "host",
  },
  {
    // Sauron
    userId: 11,
    eventId: 15,
    status: "member",
  },
  {
    // Orc army
    userId: 19,
    eventId: 14,
    status: "attending",
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
