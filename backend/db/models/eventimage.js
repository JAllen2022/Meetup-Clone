"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventImage.belongsTo(models.Event, { foreignKey: "eventId" });
    }
  }
  EventImage.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          // Validate that input is a URL
          isUrl: true,
        },
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          // Validate that input is a boolean
          validateBoolean(value) {
            if (typeof value !== "boolean") {
              throw new Error("Input value for preview must be a boolean");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "EventImage",
    }
  );
  return EventImage;
};
