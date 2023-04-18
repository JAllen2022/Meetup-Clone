"use strict";
const { Model, Validate } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.EventImage, {
        foreignKey: "eventId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Event.hasMany(models.Attendance, {
        foreignKey: "eventId",
        as: "attendances",
        onDelete: "CASCADE",
        hooks: true,
      });

      Event.belongsTo(models.Venue, { foreignKey: "venueId" });
      Event.belongsTo(models.Group, { foreignKey: "groupId" });
    }
  }
  Event.init(
    {
      venueId: {
        type: DataTypes.INTEGER,
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          //Input string must be at least 5 characters
          nameLengthValidate(value) {
            if (value.length < 5) {
              throw new Error("Name must be at least 5 characters");
            }
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          //Validate that the type of event must be 'Online' or 'In person'
          isIn: [["Online", "In person"]],
        },
      },
      capacity: {
        type: DataTypes.INTEGER,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      // defaultScope:{
      //   attributes:{
      //     exclude:['createdAt','updatedAt','description','capacity','price']
      //   }
      // },
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
