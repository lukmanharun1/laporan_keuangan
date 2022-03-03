'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dividen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Dividen.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    cash: {
      type: DataTypes.INTEGER(6),
      allowNull: false
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Dividen',
    tableName: 'dividen'
  });
  return Dividen;
};