'use strict';
const { Op } = require('sequelize');

const options={};
options.tableName='Events';
if(process.env.NODE_ENV ==='production'){
  options.schema = process.env.SCHEMA;
};

const demo_events=[
  {
    venueId:1,
    groupId:1,
    name:'Treasure Island Car Meet-up',
    description: 'Car meet-up on Saturday. Meeting at 12:00 noon on Treasure Island - the Pat parking lot. Cars will be displayed for public viewing. The group will leave at 3:00pm for a drive down Highway 1',
    type:'In person event',
    capacity:100,
    price:19.95,
    startDate:'2022-01-21-12-0-0',
    endDate:'2022-01-21-15-0-0',
  },
  {
    venueId:2,
    groupId:2,
    name:'Traders United Sunday Brunch',
    description: 'Meetup for traders to discuss trades from previous week as well as plans/outlook for upcoming week over all you can drink mimosas',
    type:'In person event',
    capacity:10,
    price:35,
    startDate:'2022-01-13-10-0-0',
    endDate:'2022-01-13-13-0-0',
  },
  {
    venueId:3,
    groupId:3,
    name:'Golden Gate Park - Saturday Run',
    description: 'Meet-up in Golden Gate park for a 10 mile run. All skill levels welcome.',
    type:'In person event',
    capacity:20,
    price:0,
    startDate:'2022-01-13-8-0-0',
    endDate:'2022-01-13-9-0-0',
  },
  {
    venueId:4,
    groupId:4,
    name:'Golden Gate Park - Soccer Tournament',
    description: 'Golden gate park soccer tourney for adult league',
    type:'In person event',
    capacity:200,
    price:15.00,
    startDate:'2022-01-27-10-0-0',
    endDate:'2022-01-27-17-0-0',
  },
  {
    venueId:4,
    groupId:4,
    name:'Golden Gate Soccer - Tuesday Nights',
    description: 'Come for a friendly match of soccer - all levels welcome - Tuesday nights at 5pm',
    type:'In person event',
    capacity:100,
    price:10.11,
    startDate:'2022-01-24-17-0-0',
    endDate:'2022-01-24-20-0-0',
  }
];

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options,demo_events);
  },

  async down (queryInterface, Sequelize) {
    const eventNames = demo_events.map(ele=>ele.name);
    await queryInterface.bulkDelete(options,{
      name:{[Op.in]:eventNames}
    });
  }
};
