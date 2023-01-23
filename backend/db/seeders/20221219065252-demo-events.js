"use strict";
const { Op } = require("sequelize");

const options = {};
options.tableName = "Events";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const demo_events = [
  {
    venueId: null,
    groupId: 1,
    name: "Treasure Island Car Meet-up",
    description:
      "Car meet-up on Saturday. Meeting at 12:00 noon on Treasure Island - the Pat parking lot. Cars will be displayed for public viewing. The group will leave at 3:00pm for a drive down Highway 1",
    type: "In person",
    capacity: 100,
    price: 19.95,
    startDate: "2023-01-29 08:00:00",
    endDate: "2023-01-29 12:00:00",
  },
  {
    venueId: null,
    groupId: 2,
    name: "Traders United Sunday Brunch",
    description:
      "Meetup for traders to discuss trades from previous week as well as plans/outlook for upcoming week over all you can drink mimosas",
    type: "In person",
    capacity: 10,
    price: 35,
    startDate: "2023-02-25 08:00:00",
    endDate: "2023-02-25 12:00:00",
  },
  {
    venueId: null,
    groupId: 3,
    name: "Golden Gate Park - Saturday Run",
    description:
      "Meet-up in Golden Gate park for a 10 mile run. All skill levels welcome.",
    type: "In person",
    capacity: 20,
    price: 0,
    startDate: "2023-03-25 08:00:00",
    endDate: "2023-03-25 12:00:00",
  },
  {
    venueId: null,
    groupId: 4,
    name: "Golden Gate Park - Soccer Tournament",
    description: "Golden gate park soccer tourney for adult league",
    type: "In person",
    capacity: 200,
    price: 15.0,
    startDate: "2023-01-25 08:00:00",
    endDate: "2023-01-25 12:00:00",
  },
  {
    venueId: null,
    groupId: 4,
    name: "Golden Gate Soccer - Tuesday Nights",
    description:
      "Come for a friendly match of soccer - all levels welcome - Tuesday nights at 5pm",
    type: "In person",
    capacity: 100,
    price: 10.11,
    startDate: "2023-01-23 08:00:00",
    endDate: "2023-01-24 14:00:00",
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, demo_events);
  },

  async down(queryInterface, Sequelize) {
    const eventNames = demo_events.map((ele) => ele.name);
    await queryInterface.bulkDelete(options, {
      name: { [Op.in]: eventNames },
    });
  },
};
