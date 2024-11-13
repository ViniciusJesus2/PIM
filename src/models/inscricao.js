const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inscricao = sequelize.define('Inscricao', {
  inscricao_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,    
    references: {
      model: 'User',
      key: 'id'
    }
  },
  vaga_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Vaga',
      key: 'id'
    }
  },
  status_inscricao: {
    type: DataTypes.ENUM('em andamento', 'processo seletivo', 'encerrado', 'aprovado'),
    defaultValue: 'em andamento',
  },
  data_inscricao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'inscricoes', 
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = {
  Inscricao,
}