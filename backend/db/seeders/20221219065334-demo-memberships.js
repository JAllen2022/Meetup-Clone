'use strict';

const { Op } = require('sequelize');

const options={}
options.tableName='Memberships'
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
};

const demo_memberships = [
  {
    userId:1,
    groupId:1,
    status:'co-host',
  },
  {
    userId:2,
    groupId:2,
    status:'co-host',
  },
  {
    userId:5,
    groupId:3,
    status:'co-host',
  },
  {
    userId:8,
    groupId:4,
    status:'co-host',
  },
  {
    userId:3,
    groupId:3,
    status:'member',
  },
  {
    userId:1,
    groupId:2,
    status:'member',
  },
  {
    userId:4,
    groupId:4,
    status:'member',
  },
  {
    userId:5,
    groupId:2,
    status:'member',
  },
  {
    userId:6,
    groupId:2,
    status:'member',
  },
  {
    userId:7,
    groupId:3,
    status:'pending',
  },
  {
    userId:1,
    groupId:2,
    status:'member',
  },
  {
    userId:1,
    groupId:3,
    status:'member',
  },
  {
    userId:1,
    groupId:4,
    status:'pending',
  }
];

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options,demo_memberships);
  },

  async down (queryInterface, Sequelize) {
    const userIds = demo_memberships.map(ele=>ele.userId);
    await queryInterface.bulkDelete(options,{
      userId:{[Op.in]:userIds}
    });
  }
};
