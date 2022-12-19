'use strict';

const options={};
options.tableName='Groups';
if(process.env.NODE_ENV ==='production'){
  options.schema = process.env.SCHEMA;
}

const demo_groups = [
  {
    organizerId:1,
    name:'Club Supra',
    about:`A club for Supra owners. IS THAT A SUPRA? We're here to answer that question. Car meets are every weekend at Treasure Island. Group occassionally does group trips down Highway 1`,
    type:'In person',
    private:false,
    city:'San Francisco',
    state:'CA'
  },
  {
    organizerId:2,
    name:'Stonk Traders United',
    about:'Group for investors and the like. Any level of knowledge welcome. A group of traders meet daily and we have group meetings/networking sessions frequently',
    type:'Online',
    private:false,
    city:'San Francisco',
    state:'CA'
  },
  {
    organizerId:5,
    name:'Golden Gate Bridge Running Group',
    about:'We are a running group based in San Francisco. Running groups meet throughout the week at various locations - all skill levels welcome - no runner is left behind',
    type:'In person',
    private:false,
    city:'San Francisco',
    state:'CA'
  },
  {
    organizerId:8,
    name:'Golden Soccer Group',
    about:'A soccer group based in San Francisco. We meet at the polo fields and Golden Gate park. All skill levels welcome',
    type:'In person',
    private:false,
    city:'San Francisco',
    state:'CA'
  },
];

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert(options,demo_groups)
  },

  async down (queryInterface, Sequelize) {
    const groupNames = demo_groups.map(ele=>ele.name);
    await queryInterface.bulkDelete(options,{
      name:{[Op.in]:groupNames}
    })
  }
};
