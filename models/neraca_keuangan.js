'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NeracaKeuangan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  NeracaKeuangan.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    aset: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    kas_dan_setara_kas: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    piutang: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    persediaan: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    aset_lancar: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    aset_tidak_lancar: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    liabilitas_jangka_pendek: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    liabilitas_jangka_panjang: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    liabilitas_berbunga: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ekuitas: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'NeracaKeuangan',
    tableName: 'neraca_keuangan',
    underscored: true,
    paranoid: true,
  });
  return NeracaKeuangan;
};