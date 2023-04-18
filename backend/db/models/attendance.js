"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.Event, {
        foreignKey: "eventId",
        as: "event",
      });
      Attendance.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Attendance.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        // default:'pending',
        allowNull: false,
        validate: {
          isIn: [["attending", "pending", "waitlist", "member", "host"]],
        },
      },
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
