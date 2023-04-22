"use strict";
const { Op } = require("sequelize");

const options = {};
options.tableName = "Events";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const demo_events = [
  {
    //1
    venueId: null,
    groupId: 1,
    name: "Treasure Island Car Meet-up",
    description:
      "Car meet-up on Saturday. Meeting at 12:00 noon on Treasure Island - the Pat parking lot. Cars will be displayed for public viewing. The group will leave at 3:00pm for a drive down Highway 1",
    type: "In person",
    capacity: 100,
    price: 19.95,
    startDate: "2023-06-29 08:00:00",
    endDate: "2023-06-29 12:00:00",
  },
  {
    //2
    venueId: null,
    groupId: 2,
    name: "Traders United Sunday Brunch",
    description:
      "Meetup for traders to discuss trades from previous week as well as plans/outlook for upcoming week over all you can drink mimosas",
    type: "In person",
    capacity: 10,
    price: 35,
    startDate: "2023-05-25 08:00:00",
    endDate: "2023-05-25 12:00:00",
  },
  {
    //3
    venueId: null,
    groupId: 3,
    name: "Golden Gate Park - Saturday Run",
    description:
      "Meet-up in Golden Gate park for a 10 mile run. All skill levels welcome.",
    type: "In person",
    capacity: 20,
    price: 0,
    startDate: "2023-05-25 08:00:00",
    endDate: "2023-05-25 12:00:00",
  },
  {
    //4
    venueId: null,
    groupId: 4,
    name: "Golden Gate Park - Soccer Tournament",
    description: "Golden gate park soccer tourney for adult league",
    type: "In person",
    capacity: 200,
    price: 15.0,
    startDate: "2023-07-25 08:00:00",
    endDate: "2023-07-25 12:00:00",
  },
  {
    //5
    venueId: null,
    groupId: 4,
    name: "Golden Gate Soccer - Tuesday Nights",
    description:
      "Come for a friendly match of soccer - all levels welcome - Tuesday nights at 5pm",
    type: "In person",
    capacity: 100,
    price: 10.11,
    startDate: "2023-06-23 08:00:00",
    endDate: "2023-06-24 14:00:00",
  },
  {
    //6
    venueId: 10,
    groupId: 5,
    name: "The Council of Elrond",
    description:
      "The Council of Elrond where the fate of the One Ring will be decided. All members are encouraged to attend and give their input.",
    type: "In person",
    capacity: 30,
    price: 0,
    startDate: "2023-05-05 18:00:00",
    endDate: "2023-05-05 22:00:00",
  },
  {
    //7
    venueId: null,
    groupId: 5,
    name: "The Breaking of the Fellowship",
    description:
      "The Fellowship of the Ring must split up to avoid detection by Sauron's forces. Members will discuss their plans for the journey ahead.",
    type: "Online",
    capacity: 50,
    price: 0,
    startDate: "2023-06-01 16:00:00",
    endDate: "2023-06-01 18:00:00",
  },
  {
    //8
    venueId: 6,
    groupId: 6,
    name: "Mine Excursion",
    description:
      "The Moria Mining Company is offering a guided tour of its mines. Members will get to see the Balrog's Chamber and other important landmarks.",
    type: "In person",
    capacity: 20,
    price: 29.99,
    startDate: "2023-08-15 10:00:00",
    endDate: "2023-08-15 14:00:00",
  },
  {
    //9
    venueId: null,
    groupId: 6,
    name: "Mithril Trade Negotiations",
    description:
      "Members will gather online to discuss the ongoing trade negotiations with the Dwarves of Erebor regarding the sale of mithril.",
    type: "Online",
    capacity: 30,
    price: 0,
    startDate: "2023-09-12 19:00:00",
    endDate: "2023-09-12 21:00:00",
  },
  {
    //10
    venueId: 7,
    groupId: 7,
    name: "Ride Across the Wold",
    description:
      "The Rohan Riders Club is organizing a ride across the vast expanse of the Wold. Members will camp out overnight.",
    type: "In person",
    capacity: 15,
    price: 49.99,
    startDate: "2023-07-22 09:00:00",
    endDate: "2023-07-23 16:00:00",
  },

  {
    //11
    venueId: null,
    groupId: 7,
    name: "Horse Training Workshop",
    description:
      "Members will gather online for a workshop on training horses for riding and combat. Experts from the Royal Stables of Rohan will lead the workshop.",
    type: "Online",
    capacity: 25,
    price: 0,
    startDate: "2023-09-09 18:00:00",
    endDate: "2023-09-09 20:00:00",
  },
  {
    //12
    venueId: 8,
    groupId: 8,
    name: "Spring Planting Festival",
    description:
      "Join us for our annual Spring Planting Festival. We'll have vendors, food, and games for the kids. Bring your green thumb and come prepared to get your hands dirty!",
    type: "In person",
    capacity: 75,
    price: 10.0,
    startDate: "2023-05-15 10:00:00",
    endDate: "2023-05-15 14:00:00",
  },
  {
    //13
    venueId: 11,
    groupId: 8,
    name: "Gardening Workshop: Pruning Techniques",
    description:
      "Join us for a workshop on pruning techniques. We'll be covering how to properly prune different types of plants and shrubs. This event is perfect for gardeners of all levels!",
    type: "In person",
    capacity: 30,
    price: 20.0,
    startDate: "2023-06-12 10:00:00",
    endDate: "2023-06-12 12:00:00",
  },
  {
    // 14
    venueId: 9,
    groupId: 9,
    name: "Annual Industrial Expo",
    description:
      "Join us for our annual Industrial Expo, where the latest advancements in industry will be on display. This event is perfect for professionals and enthusiasts alike.",
    type: "In person",
    capacity: 100,
    price: 50.0,
    startDate: "2023-07-08 09:00:00",
    endDate: "2023-07-08 17:00:00",
  },
  {
    //15
    venueId: 12,
    groupId: 9,
    name: "Workshop: Introduction to Orcish Blacksmithing",
    description:
      "Join us for a workshop on Orcish blacksmithing techniques. Learn how to forge weapons and armor in the traditional Orcish style. This workshop is perfect for beginners and enthusiasts alike!",
    type: "In person",
    capacity: 20,
    price: 75.0,
    startDate: "2023-08-12 10:00:00",
    endDate: "2023-08-12 14:00:00",
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
