const express = require('express');
const inscricaoController = require('../controllers/inscricaoController');

const router = express.Router();

router.post('/inscricoes', inscricaoController.candidatarVaga);
router.get('/inscricoes/vaga/:vaga_id', inscricaoController.analisarCandidatos);
router.get('/inscricoes/usuario/:user_id', inscricaoController.acompanharCandidatura);

router.delete('/api/inscricoes/cancelar/:inscricaoId', inscricaoController.cancelarInscricao);

module.exports = router;
