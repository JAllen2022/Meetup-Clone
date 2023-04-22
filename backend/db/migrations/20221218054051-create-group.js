"use strict";

// MAKE SURE to include this in all migrations/seeders
// Make sure to include options as well as it is done bellow
const options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Groups",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        organizerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            key: "id",
          },
        },
        name: {
          type: Sequelize.STRING(60),
          allowNull: false,
          unique: true,
        },
        about: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        type: {
          type: Sequelize.STRING,
          // defaultValue:'Online',
          allowNull: false,
        },
        private: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        city: {
          type: Sequelize.STRING(100)
        },
        state: {
          type: Sequelize.STRING(30)
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    await queryInterface.dropTable(options);
  },
};
