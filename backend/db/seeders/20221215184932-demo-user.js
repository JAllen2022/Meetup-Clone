'use strict';
const bcrypt = require('bcryptjs');
const { Op }= require('sequelize');

let options={};
if(process.env.NODE_ENV ==='production'){
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = 'Users';
   await queryInterface.bulkInsert(options,[
    {
      email:'demo@user.io',
      username: 'Demo-lition',
      hashedPassword: bcrypt.hashSync('password'),
      firstName:'User1',
      lastName:'User1'
    },
    {
      email:'fakeUser1@user.io',
      username:'FakeUser1',
      hashedPassword: bcrypt.hashSync('password2'),
      firstName:'User2',
      lastName:'User2'
    },{
      email:'fakeUser2@user.io',
      username:'FakeUser2',
      hashedPassword: bcrypt.hashSync('password3'),
      firstName:'User3',
      lastName:'User3'
    },
    {
      email:'yaboi39@user.io',
      username:'yaboi39',
      hashedPassword: bcrypt.hashSync('password4'),
      firstName:'Jake',
      lastName:'Carlton'
    },
    {
      email:'feltGem@user.io',
      username:'gemcollector',
      hashedPassword: bcrypt.hashSync('password5'),
      firstName:'Herald',
      lastName:'Arren'
    },
    {
      email:'callofdutyslayer@user.io',
      username:'helloworld',
      hashedPassword: bcrypt.hashSync('password6'),
      firstName:'Kale',
      lastName:'Salad'
    },
    {
      email:'jambajuicelover@user.io',
      username:'jambaJuice',
      hashedPassword: bcrypt.hashSync('password7'),
      firstName:'Jeremy',
      lastName:'Clarkson'
    },
    {
      email:'argentinaFifa2022@user.io',
      username:'iOnlyWin',
      hashedPassword: bcrypt.hashSync('password8'),
      firstName:'Lionel',
      lastName:'Messi'
    }
   ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.bulkDelete(options,
      // {username:{ [Op.in]:['Demo-lition','FakeUser1','FakeUser2']}}
      null
      ,{});
  }
};
