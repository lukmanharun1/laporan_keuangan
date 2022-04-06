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
      this.hasMany(models.LaporanKeuangan, {
        foreignKey: 'emiten_id',
        as: 'laporan_keuangan'
      })
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
      allowNull: false,
      unique: true
    },
    nama_emiten: {
      type: DataTypes.STRING(255),
      primaryKey: false,
      unique: true
    },
   
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Emiten',
    tableName: 'emiten',
    underscored: true,
    paranoid: true,
  });
  return Emiten;
};