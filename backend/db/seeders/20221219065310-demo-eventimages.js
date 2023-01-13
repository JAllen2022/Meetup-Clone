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
    url: "https://static.carthrottle.com/workspace/uploads/posts/2015/07/s2ki-55bb0341b42e4.jpg",
    preview: true,
  },
  {
    eventId: 2,
    url: "https://tampamagazines.com/wp-content/uploads/2018/01/the-c-house-banner.jpg",
    preview: true,
  },
  {
    eventId: 3,
    url: "https://static.rootsrated.com/image/upload/s--CymMjhQG--/t_rr_large_natural/evkxtwfezjfj2eo62bpo.jpg",
    preview: true,
  },
  {
    eventId: 4,
    url: "https://sfrecpark.org/ImageRepository/Document?documentID=3983",
    preview: false,
  },
  {
    eventId: 5,
    url: "https://sfrecpark.org/ImageRepository/Document?documentID=3983",
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
