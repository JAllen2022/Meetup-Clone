'use strict';

const options={};
options.tableName='Events';
if(process.env.NODE_ENV ==='production'){
  options.schema = process.env.SCHEMA;
}

demo_events=[

]

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options,demo_events)
  },

  async down (queryInterface, Sequelize) {
    const eventNames = demo_events(ele=>ele.name)
    await queryInterface.bulkDelete(options,{
      name:{[Op.in]:eventNames}
    })
  }
};
