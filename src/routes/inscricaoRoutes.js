const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  candidatarVaga,
  acompanharCandidatura,
  obterInscricoes,
  cancelarInscricao,
  obterCandidatos,
  alterarStatus,
  obterPerfilCandidato,

} = require('../controllers/inscricaoController');

// Rota para candidatar-se a uma vaga
router.post('/candidatar', authenticateToken, candidatarVaga);

// Rota para acompanhar candidaturas de um usuário
router.get('/inscricoes', authenticateToken, obterInscricoes);

// Rota para o profissional cancelar uma inscrição
router.put('/cancelar-inscricao/:inscricaoId', authenticateToken, cancelarInscricao);

router.get('/vagas/:vagaId/candidatos', authenticateToken, obterCandidatos);

router.put('/inscricoes/:inscricaoId/status', authenticateToken, alterarStatus);

router.get('/perfil/:userId', authenticateToken, obterPerfilCandidato);

module.exports = router;
