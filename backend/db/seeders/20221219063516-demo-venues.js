"use strict";

const { Op } = require("sequelize");

const options = {};
options.tableName = "Venues";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const demo_venues = [
  {
    // 1
    groupId: 1,
    address: "Treasure Island - Pat Parking Lot",
    city: "San Francisco",
    state: "CA",
    lat: 37.8165,
    lng: -122.3721,
  },
  {
    //2
    groupId: 4,
    address: "Beach Chalet Soccer Fields - Golden Gate Park",
    city: "San Francisco",
    state: "CA",
    lat: 37.76737,
    lng: -122.50888,
  },
  {
    //3
    groupId: 2,
    address: "Friends Brunch Palace - 123 Polk Street",
    city: "San Francisco",
    state: "CA",
    lat: 37.201,
    lng: -122.392,
  },
  {
    //4
    groupId: 3,
    address: "Golden Gate Park - Buffalo Fields",
    city: "San Francisco",
    state: "CA",
    lat: 37.402,
    lng: -122.102,
  },
  {
    //5
    groupId: 5,
    address: "The Prancing Pony Inn",
    city: "Bree",
    state: "Eriador",
    lat: 51.8008,
    lng: -1.2156,
  },
  {
    //6
    groupId: 6,
    address: "The Chamber of Mazarbul",
    city: "Moria",
    state: "Misty Mountains",
    lat: 47.5107,
    lng: -120.7401,
  },
  {
    //7
    groupId: 7,
    address: "Edoras Stables",
    city: "Edoras",
    state: "Rohan",
    lat: -43.3138,
    lng: 172.0345,
  },
  {
    //8
    groupId: 8,
    address: "Minas Tirith Botanical Gardens",
    city: "Minas Tirith",
    state: "Gondor",
    lat: -32.0891,
    lng: 115.7803,
  },
  {
    //9
    groupId: 9,
    address: "Orthanc Tower",
    city: "Isengard",
    state: "Dunland",
    lat: 51.2744,
    lng: -0.4105,
  },
  {
    //10
    groupId: 5,
    address: "Rivindell",
    address: "Rivendell",
    city: "Eriador",
    state: "Middle-earth",
    lat: 44.0574,
    lng: -121.3082,
  },
  {
    //11
    groupId: 8,
    address: "Pelennor Fields",
    city: "Minas Tirith",
    state: "Gondor",
    lat: -32.537,
    lng: 28.0562,
  },
  {
    //12
    groupId: 9,
    address: "Isengard Industrial Complex",
    city: "Isengard",
    state: "Dunland",
    lat: -37.9269,
    lng: 174.8519,
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
