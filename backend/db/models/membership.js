'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Membership.belongsTo(models.User,{foreignKey:'userId'});
      Membership.belongsTo(models.Group,{foreignKey:'groupId'})
    }
  }
  Membership.init({
    userId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    groupId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        // Group couldn't be found?
      }
    },
    status: {
      type:DataTypes.ENUM('member','pending','co-host'),
      defaultValue:'pending',
      validate:{
        // Current User already has a pending membership for the group,
        // Current User already accepted member
        // Cannot change memberhsip status to pending
      }
    },
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
