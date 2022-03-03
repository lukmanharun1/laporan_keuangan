'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Emiten extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Emiten.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    jumlah_saham: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    kode_emiten: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    nama_emiten: {
      type: DataTypes.STRING(255),
      primaryKey: false
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Emiten',
    tableName: 'emiten'
  });
  return Emiten;
};