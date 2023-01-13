"use strict";

const { Op } = require("sequelize");

const options = {};
options.tableName = "Venues";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const demo_venues = [
  {
    groupId: 1,
    address: "Treasure Island - Pat Parking Lot",
    city: "San Francisco",
    state: "CA",
    lat: 37.8165,
    lng: -122.3721,
  },
  {
    groupId: 4,
    address: "Beach Chalet Soccer Fields - Golden Gate Park",
    city: "San Francisco",
    state: "CA",
    lat: 37.76737,
    lng: -122.50888,
  },
  {
    groupId: 2,
    address: "Friends Brunch Palace - 123 Polk Street",
    city: "San Francisco",
    state: "CA",
    lat: 37.201,
    lng: -122.392,
  },
  {
    groupId: 3,
    address: "Golden Gate Park - Buffalo Fields",
    city: "San Francisco",
    state: "CA",
    lat: 37.402,
    lng: -122.102,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, demo_venues);
  },

  async down(queryInterface, Sequelize) {
    const venueAddress = demo_venues.map((ele) => ele.address);
    await queryInterface.bulkDelete(options, {
      address: { [Op.in]: venueAddress },
    });
  },
};
