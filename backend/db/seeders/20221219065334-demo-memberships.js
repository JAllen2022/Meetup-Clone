"use strict";

const { Op } = require("sequelize");

const options = {};
options.tableName = "Memberships";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const demo_memberships = [
  // Group 1 - Club Supra
  {
    // Jeremy Clarkson
    userId: 12,
    groupId: 1,
    status: "host",
  },
  {
    // Richard Hammond
    userId: 13,
    groupId: 1,
    status: "co-host",
  },
  {
    // James May
    userId: 14,
    groupId: 1,
    status: "co-host",
  },
  {
    // Demo User
    userId: 1,
    groupId: 1,
    status: "member",
  },
  // Group 2 - Stonk Traders United
  {
    // Demo User
    userId: 1,
    groupId: 2,
    status: "host",
  },
  {
    // Richard Hammond
    userId: 13,
    groupId: 2,
    status: "member",
  },
  // Group 3 - Golden Gate Bridge Running Group
  {
    // Samwise Gamgee
    userId: 5,
    groupId: 3,
    status: "host",
  },
  {
    // Richard Hammond
    userId: 13,
    groupId: 3,
    status: "member",
  },
  {
    // Jeremy Clarkson
    userId: 12,
    groupId: 3,
    status: "member",
  },
  // Group 4 - Golden Soccer Group
  {
    // Demo User
    userId: 1,
    groupId: 4,
    status: "host",
  },
  {
    // Sauron
    userId: 11,
    groupId: 4,
    status: "co-host",
  },
  {
    // Boromir
    userId: 8,
    groupId: 4,
    status: "member",
  },
  {
    // Gimli
    userId: 7,
    groupId: 4,
    status: "member",
  },
  {
    // Frodo
    userId: 4,
    groupId: 4,
    status: "member",
  },
  // Group 5 - Fellowship of the Ring
  {
    // Gandalf
    userId: 2,
    groupId: 5,
    status: "host",
  },
  {
    // Gandalf
    userId: 3,
    groupId: 5,
    status: "host",
  },
  {
    // Frodo
    userId: 4,
    groupId: 5,
    status: "member",
  },
  {
    // Samwise
    userId: 5,
    groupId: 5,
    status: "member",
  },
  {
    // Bilbo
    userId: 6,
    groupId: 5,
    status: "member",
  },
  {
    // Gimli
    userId: 7,
    groupId: 5,
    status: "member",
  },
  {
    // Boromir
    userId: 8,
    groupId: 5,
    status: "member",
  },
  {
    // Legolas
    userId: 10,
    groupId: 5,
    status: "member",
  },
  {
    // Merry
    userId: 16,
    groupId: 5,
    status: "member",
  },
  {
    // Pippin
    userId: 17,
    groupId: 5,
    status: "member",
  },
  // Group 6 - Moria Mining Company
  {
    // Gimli
    userId: 7,
    groupId: 6,
    status: "host",
  },
  {
    // Legolas
    userId: 10,
    groupId: 6,
    status: "member",
  },
  {
    // Demo User
    userId: 1,
    groupId: 6,
    status: "member",
  },
  // Group 7 - Rohan Riders Club
  {
    // Eomer
    userId: 15,
    groupId: 7,
    status: "host",
  },
  {
    // Aragorn
    userId: 2,
    groupId: 7,
    status: "member",
  },
  {
    // Demo User
    userId: 1,
    groupId: 7,
    status: "member",
  },
  // Group 8 - Gondor Gardeners Society
  {
    // Eomer
    userId: 2,
    groupId: 8,
    status: "host",
  },
  {
    // Gandalf
    userId: 3,
    groupId: 8,
    status: "co-host",
  },
  {
    // Demo User
    userId: 1,
    groupId: 8,
    status: "member",
  },
  // Group 9 - Isengard Industrialists Association
  {
    // Saruman
    userId: 18,
    groupId: 9,
    status: "host",
  },
  {
    // Sauron
    userId: 11,
    groupId: 9,
    status: "co-host",
  },
  {
    // Orc army
    userId: 19,
    groupId: 9,
    status: "member",
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, demo_memberships);
  },

  async down(queryInterface, Sequelize) {
    const userIds = demo_memberships.map((ele) => ele.userId);
    await queryInterface.bulkDelete(options, {
      userId: { [Op.in]: userIds },
    });
  },
};
