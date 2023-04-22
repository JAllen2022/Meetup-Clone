"use strict";

const { Op } = require("sequelize");

const options = {};
options.tableName = "Groups";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const demo_groups = [
  {
    // 1
    organizerId: 12,
    name: "Club Supra",
    about: `A club for Supra owners. IS THAT A SUPRA? We're here to answer that question. Car meets are every weekend at Treasure Island. Group occassionally does group trips down Highway 1`,
    type: "In person",
    private: false,
    city: "San Francisco",
    state: "CA",
  },
  {
    // 2
    organizerId: 1,
    name: "Stonk Traders United",
    about:
      "Group for investors and the like. Any level of knowledge welcome. A group of traders meet daily and we have group meetings/networking sessions frequently",
    type: "Online",
    private: false,
    city: "San Francisco",
    state: "CA",
  },
  {
    // 3
    organizerId: 5,
    name: "Golden Gate Bridge Running Group",
    about:
      "We are a running group based in San Francisco. Running groups meet throughout the week at various locations - all skill levels welcome - no runner is left behind",
    type: "In person",
    private: true,
    city: "San Francisco",
    state: "CA",
  },
  {
    // 4
    organizerId: 8,
    name: "Golden Soccer Group",
    about:
      "A soccer group based in San Francisco. We meet at the polo fields and Golden Gate park. All skill levels welcome",
    type: "In person",
    private: false,
    city: "San Francisco",
    state: "CA",
  },
  {
    // 5
    organizerId: 3,
    name: "Fellowship of the Ring",
    about:
      "A group dedicated to discussing and exploring the lore and world of J.R.R. Tolkien's Middle-earth. We meet weekly to watch the movies, read the books, and discuss all things related to Lord of the Rings.",
    type: "In person",
    private: false,
    city: "New York",
    state: "NY",
  },
  {
    // 6
    organizerId: 7,
    name: "Moria Mining Company",
    about:
      "A group for miners and geologists interested in dwarvish mining techniques and the treasures of Moria. We share information and tips about mining in Middle-earth and occasionally plan group expeditions to search for rare minerals.",
    type: "In person",
    private: false,
    city: "Butte",
    state: "Montana",
  },
  {
    // 7
    organizerId: 15,
    name: "Rohan Riders Club",
    about:
      "A group for horse lovers who appreciate the skill and courage of Rohan's legendary riders. We organize group horseback riding trips, watch the horse racing and discuss everything related to Rohan and their equestrian traditions.",
    type: "In person",
    private: false,
    city: "Houston",
    state: "TX",
  },
  {
    // 8
    organizerId: 2,
    name: "Gondor Gardeners Society",
    about:
      "A group for green thumbs and gardening enthusiasts. We focus on the plants, flowers and trees mentioned in Lord of the Rings, exchange gardening tips and occasionally visit notable gardens in the area.",
    type: "In person",
    private: true,
    city: "Seattle",
    state: "WA",
  },
  {
    // 9
    organizerId: 11,
    name: "Isengard Industrialists Association",
    about:
      "A group for engineers and industrialists interested in the technology and machinery of Isengard. We discuss the creation and function of the orcish war machines, the factories and foundries of Saruman and the innovations in the field of industry.",
    type: "In person",
    private: false,
    city: "Helena",
    state: "Montana",
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, demo_groups);
  },

  async down(queryInterface, Sequelize) {
    const groupNames = demo_groups.map((ele) => ele.name);
    await queryInterface.bulkDelete(options);
  },
};
