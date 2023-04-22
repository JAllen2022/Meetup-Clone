"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.hasMany(models.Event, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Group.hasMany(models.Venue, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Group.hasMany(models.Membership, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true,
      });

      Group.belongsTo(models.User, { foreignKey: "organizerId" });
    }
  }
  Group.init(
    {
      organizerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique:true,
        validate: {
          //Validate name is 60 characters or less
          len: [0, 60],
        },
      },
      about: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          //Validate that about secion is 50 characters or more
          checkLength(value) {
            if (value.length < 50) {
              throw new Error("About must be 50 characters or more");
            }
          },
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          //Validate that type of event is either online or in person
          isIn: [["Online", "In person"]],
        },
      },
      private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          //Validate that the type is a boolean
          validateBoolean(value) {
            if (typeof value !== "boolean") {
              throw new Error("Private must be a boolean");
            }
          },
        },
      },
      city: {
        type: DataTypes.STRING(100),
      },
      state: {
        type: DataTypes.STRING(30),
      },
    },
    {
      sequelize,
      modelName: "Group",
    }
  );
  return Group;
};
