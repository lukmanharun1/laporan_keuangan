"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LabaRugi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LabaRugi.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      pendapatan: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      laba_kotor: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      laba_usaha: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      beban_bunga: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      laba_sebelum_pajak: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      laba_bersih: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "LabaRugi",
      tableName: "laba_rugi",
      underscored: true,
      paranoid: true,
    }
  );
  return LabaRugi;
};
