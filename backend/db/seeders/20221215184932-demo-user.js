'use strict';
const bcrypt = require('bcryptjs')
const {Op}= require('sequelize')

let options={};
if(process.env.NODE_ENV ==='production'){
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('Users',[
    {
      email:'demo@user.io',
      username: 'Demo-lition',
      hashedPassword: bcrypt.hashSync('password')
    },
    {
      email:'fakeUser1@user.io',
      username:'FakeUser1',
      hashedPassword: bcrypt.hashSync('password2')
    },{
      email:'fakeUser2@user.io',
      username:'FakeUser2',
      hashedPassword: bcrypt.hashSync('password2')
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users',{
      username:{ [Op.in]:['Demo-lition','FakeUser1','FakeUser2']}
    },{})
  }
};
