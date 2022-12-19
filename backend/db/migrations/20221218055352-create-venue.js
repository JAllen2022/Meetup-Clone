'use strict';

let options={}

if(process.env.NODE_ENV === 'production'){
  options.schema=process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Venues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Groups',
          key:'id'
        }
      },
      address: {
        type: Sequelize.STRING(100),
        allowNull:false
      },
      city: {
        type: Sequelize.STRING(50),
        allowNull:false
      },
      state: {
        type: Sequelize.STRING(30),
        allowNull:false
      },
      lat: {
        type: Sequelize.DECIMAL,
        allowNull:false
      },
      lng: {
        type: Sequelize.DECIMAL,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName='Venues'
    await queryInterface.dropTable(options);
  }
};
