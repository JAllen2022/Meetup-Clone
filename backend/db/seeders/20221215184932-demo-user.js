"use strict";
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Users";
    await queryInterface.bulkInsert(options, [
      {
        email: "demo@user.io",
        username: "Demo-lition",
        hashedPassword: bcrypt.hashSync("password"),
        firstName: "Demo",
        lastName: "User",
      },
      {
        email: "demo2@user.io",
        username: "demo2",
        hashedPassword: bcrypt.hashSync("password"),
        firstName: "Aragorn",
        lastName: "II Elesar",
      },
      {
        email: "demo3@user.io",
        username: "demo3",
        hashedPassword: bcrypt.hashSync("password"),
        firstName: "Gandalf",
        lastName: "The Gray",
      },
      {
        email: "demo4@user.io",
        username: "demo4",
        hashedPassword: bcrypt.hashSync("password"),
        firstName: "Frodo",
        lastName: "Baggins",
      },
      {
        email: "demo11@user.io",
        username: "demo11",
        hashedPassword: bcrypt.hashSync("password"),
        firstName: "Samwise",
        lastName: "Gamgee",
      },
      {
        email: "demo12@user.io",
        username: "demo12",
        hashedPassword: bcrypt.hashSync("password"),
        firstName: "Bilbo",
        lastName: "Baggins",
      },
      {
        email: "demo13@user.io",
        username: "demo13",
        hashedPassword: bcrypt.hashSync("password"),
        firstName: "Gimli",
        lastName: "Son of Glóin",
      },
      {
        email: "demo14@user.io",
        username: "demo14",
        hashedPassword: bcrypt.hashSync("password"),
        firstName: "Boromir",
        lastName: "The I",
      },
      {
        email: "demo5@user.io",
        username: "demo5",
        hashedPassword: bcrypt.hashSync("password"),
        firstName: "Elrond",
        lastName: "Lord of Rivendell",
      },
      {
        email: "demo6@user.io",
        username: "demo6",
        hashedPassword: bcrypt.hashSync("password"),
        firstName: "Lego",
        lastName: "Las",
      },
      {
        email: "demo7@user.io",
        username: "demo7",
        hashedPassword: bcrypt.hashSync("password"),
        firstName: "Sauron",
        lastName: "Lord of the Ring",
      },
      {
        email: "demo8@user.io",
        username: "demo8",
        hashedPassword: bcrypt.hashSync("password"),
        firstName: "Jeremy",
        lastName: "Clarkson",
      },
      {
        email: "demo9@user.io",
        username: "demo9",
        hashedPassword: bcrypt.hashSync("password"),
        firstName: "Richard",
        lastName: "Hammond",
      },
      {
        email: "demo10@user.io",
        username: "demo10",
        hashedPassword: bcrypt.hashSync("password"),
        firstName: "James",
        lastName: "May",
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    await queryInterface.bulkDelete(
      options,
      // {username:{ [Op.in]:['Demo-lition','FakeUser1','FakeUser2']}}
      null,
      {}
    );
  },
};
