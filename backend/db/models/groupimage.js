'use strict';
const {
  Model
} = require('sequelize');
const {Group} = require('./index')
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     GroupImage.belongsTo(models.Group,{foreignKey:'groupId'});
    }
  }
  GroupImage.init({
    groupId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        // "message": "Event couldn't be found",? do we need to validate here
        // ~~~~ check on this ~~~~~
      }
    },
    url: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        //Validate that input is a URL
        isUrl:true
      }
    },
    preview: {
      type:DataTypes.BOOLEAN,
      allowNull:false,
      validate:{
        //Validate that it is a boolean value
        validateBoolean(value) {
          if(typeof value !=='boolean'){
            throw new Error('Input for preview must be a boolean true/false value')
          }
        }
      }
    },
  }, {
    sequelize,
    modelName: 'GroupImage',
  });
  return GroupImage;
};
