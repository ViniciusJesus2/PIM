// vagas.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 


const Vaga = sequelize.define('Vaga', {
  vaga_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  empresa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'UserEmpresaProfile',
      key: 'id'
    }
  },
  empresa_nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  localizacao: {
    type: DataTypes.STRING,
  },
  salario: {
    type: DataTypes.DECIMAL(10, 2),
  },
  tipo_contrato: {
    type: DataTypes.ENUM('CLT', 'PJ', 'Freelancer', 'Estágio'),
    allowNull: false,
  },
  nivel_experiencia: {
    type: DataTypes.ENUM('Júnior', 'Pleno', 'Sênior'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Aberta', 'Fechada'),
    defaultValue: 'Aberta',
  },
}, {
  timestamps: true,
  paranoid: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

module.exports = {
  Vaga,
  sequelize
};
