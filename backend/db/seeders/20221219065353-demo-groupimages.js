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
    url: "https://static.carthrottle.com/workspace/uploads/posts/2015/07/s2ki-55bb0341b42e4.jpg",
    preview: true,
  },
  {
    groupId: 2,
    url: "https://tampamagazines.com/wp-content/uploads/2018/01/the-c-house-banner.jpg",
    preview: true,
  },
  {
    groupId: 3,
    url: "https://static.rootsrated.com/image/upload/s--CymMjhQG--/t_rr_large_natural/evkxtwfezjfj2eo62bpo.jpg",
    preview: true,
  },
  {
    groupId: 4,
    url: "https://sfrecpark.org/ImageRepository/Document?documentID=3983",
    preview: true,
  },
  {
    groupId: 2,
    url: "https://static.carthrottle.com/workspace/uploads/posts/2015/07/s2ki-55bb0341b42e4.jpg",
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
