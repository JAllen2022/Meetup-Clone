"use strict";

const { Op } = require("sequelize");

const options = {};
options.tableName = "Memberships";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const demo_memberships = [
  {
    userId: 12,
    groupId: 1,
    status: "host",
  },
  {
    userId: 13,
    groupId: 1,
    status: "co-host",
  },
  {
    userId: 14,
    groupId: 1,
    status: "co-host",
  },
  {
    userId: 1,
    groupId: 2,
    status: "host",
  },
  {
    userId: 1,
    groupId: 4,
    status: "co-host",
  },
  {
    userId: 5,
    groupId: 3,
    status: 'host'
  }
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
