"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      nama_lengkap: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      is_verified_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        defaultValue: "user",
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "User",
      tableName: "user",
      underscored: true,
      paranoid: true,
    }
  );
  return User;
};
