"use strict";
const { Op } = require("sequelize");

const options = {};
options.tableName = "EventImages";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const demo_eventImages = [
  {
    eventId: 1,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event1.jpeg",
    preview: true,
  },
  {
    eventId: 2,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event2.jpeg",
    preview: true,
  },
  {
    eventId: 3,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event3.jpeg",
    preview: true,
  },
  {
    eventId: 4,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event4-5.png",
    preview: true,
  },
  {
    eventId: 5,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event4-5.png",
    preview: true,
  },
  {
    eventId: 6,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event6.png",
    preview: true,
  },
  {
    eventId: 7,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event7.png",
    preview: true,
  },
  {
    eventId: 8,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event8.jpeg",
    preview: true,
  },
  {
    eventId: 9,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event9.png",
    preview: true,
  },
  {
    eventId: 10,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event10.jpeg",
    preview: true,
  },
  {
    eventId: 11,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event11.png",
    preview: true,
  },
  {
    eventId: 12,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event12.png",
    preview: true,
  },
  {
    eventId: 13,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event13.jpeg",
    preview: true,
  },
  {
    eventId: 14,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event14.png",
    preview: true,
  },
  {
    eventId: 15,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Event15.png",
    preview: true,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, demo_eventImages);
  },

  async down(queryInterface, Sequelize) {
    const eventImageIds = demo_eventImages.map((ele) => ele.eventId);
    await queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: eventImageIds },
    });
  },
};
