'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LaporanKeuangan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.NeracaKeuangan, {
        foreignKey: 'id'
      });
    }
  };
  LaporanKeuangan.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    emiten_id: {
      type:DataTypes.UUID,
      allowNull: false
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false
    },
    jenis_laporan: {
      type: DataTypes.ENUM('Q1', 'Q2', 'Q3', 'TAHUNAN'),
      allowNull: false
    },
    harga_saham: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
    },
    nama_file: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'LaporanKeuangan',
    tableName: 'laporan_keuangan',
    underscored: true,
    paranoid: true,
  });
  return LaporanKeuangan;
};