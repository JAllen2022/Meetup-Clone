'use strict';

const options={};
if(production.env.NODE_ENV === 'production'){
  options.schema = production.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Memberships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      status: {
        type: Sequelize.ENUM,
        values:[
          'member','pending','co-host'
        ],
        defaultValue:'pending'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        ç
      }
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName='Memberships'
    await queryInterface.dropTable(options);
  }
};
