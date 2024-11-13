const Inscricao = require('../models/inscricao');
const User = require('../models/user'); // Modelo de usuário, assumindo que esteja corretamente 
const jwt = require('jsonwebtoken');

// Candidatar-se a uma vaga
const candidatarVaga = async (req, res) => {
  try {
    // Verifica e decodifica o token
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { vaga_id } = req.body;

    // Cria a inscrição usando o `user_id` extraído do token
    const inscricao = await Inscricao.create({
      user_id: userId,
      vaga_id,
    });

    res.status(201).json({ message: 'Candidatura realizada com sucesso!', inscricao });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao se candidatar à vaga.' });
  }
};

// Analisar candidaturas para uma vaga
const analisarCandidatos = async (req, res) => {
  const { vaga_id } = req.params;

  try {
    const candidaturas = await Inscricao.findAll({
      where: { vaga_id },
      include: [{
        model: User,
        as: 'user', // Assumindo que a associação está definida com o alias 'user' no modelo
        attributes: ['id', 'nome', 'email'] // Atributos do usuário para retornar
      }]
    });

    res.status(200).json(candidaturas);
  } catch (error) {
    console.error('Erro ao buscar candidaturas:', error);
    res.status(500).json({ message: 'Erro ao buscar candidaturas.' });
  }
};

// Acompanhar candidaturas de um usuário
const acompanharCandidatura = async (req, res) => {
  const userId = req.user.id; // Obtendo o ID do usuário autenticado do token

  try {
    const candidaturas = await Inscricao.findAll({
      where: { user_id: userId },
      include: [{
        model: Vaga, // Supondo que você tenha um modelo 'Vaga'
        as: 'vaga',
        attributes: ['vaga_id', 'titulo', 'descricao'] // Atributos da vaga para retornar
      }]
    });

    res.status(200).json(candidaturas);
  } catch (error) {
    console.error('Erro ao acompanhar candidaturas:', error);
    res.status(500).json({ message: 'Erro ao acompanhar candidaturas.' });
  }
};

// Função para cancelar a inscrição
const cancelarInscricao = async (req, res) => {
  const { inscricaoId } = req.params;

  try {
      const inscricao = await Inscricao.findByPk(inscricaoId);

      if (!inscricao) {
          return res.status(404).json({ message: 'Inscrição não encontrada.' });
      }

      // Verifica se o status da inscrição é "em andamento" antes de permitir o cancelamento
      if (inscricao.status_inscricao !== 'em andamento') {
          return res.status(400).json({ message: 'Não é possível cancelar uma inscrição em processo seletivo ou encerrada.' });
      }

      // Marca a inscrição como cancelada ou exclui, conforme sua lógica
      await inscricao.update({ status_inscricao: 'cancelada' });

      res.status(200).json({ message: 'Inscrição cancelada com sucesso!' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao cancelar inscrição.' });
  }
};

const obterInscricoes = async (req, res) => {
  const userId = req.userId; // Verifique se o userId foi extraído corretamente do token
  if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado!' });
  }

  try {
      const inscricoes = await Inscricao.findAll({
          where: { user_id: userId },
          include: [{ model: Vaga, attributes: ['titulo', 'descricao'] }]  // Incluindo a vaga relacionada
      });

      if (inscricoes.length === 0) {
          return res.status(404).json({ message: 'Você não tem inscrições.' });
      }

      return res.status(200).json(inscricoes);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar inscrições.' });
  }
};


module.exports = {
  candidatarVaga,
  analisarCandidatos,
  acompanharCandidatura,
  cancelarInscricao,
  obterInscricoes,
};
