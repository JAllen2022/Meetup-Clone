"use strict";

const { Op } = require("sequelize");

const options = {};
options.tableName = "GroupImages";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const demo_groupImages = [
  {
    groupId: 1,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Group1.jpeg",
    preview: true,
  },
  {
    groupId: 2,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Group2.png",
    preview: true,
  },
  {
    groupId: 3,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Group3.png",
    preview: true,
  },
  {
    groupId: 4,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Group4.jpeg",
    preview: true,
  },
  {
    groupId: 5,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Group5.png",
    preview: true,
  },
  {
    groupId: 6,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Group6.jpeg",
    preview: true,
  },
  {
    groupId: 7,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Group7.jpg",
    preview: true,
  },
  {
    groupId: 8,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/Group8.jpg",
    preview: true,
  },
  {
    groupId: 9,
    url: "https://appacademypictures.s3.us-west-2.amazonaws.com/group9.jpg",
    preview: true,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, demo_groupImages);
  },

  async down(queryInterface, Sequelize) {
    const groupImageGroupId = demo_groupImages.map((ele) => ele.groupId);
    await queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: groupImageGroupId },
    });
  },
};
