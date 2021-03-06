module.exports = (Sequelize) => {
  return {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
    },
    updated_at: {
      type: Sequelize.DATE,
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
  };
};
