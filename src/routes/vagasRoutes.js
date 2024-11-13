const express = require('express');
const vagaController = require('../controllers/vagaController');

const router = express.Router();

// Rota para criar vaga
router.post('/vagas', vagaController.criarVaga);
router.get('/vagas', vagaController.listarVagas);
router.get('/vagas/:id', vagaController.buscarVagaPorId);
router.put('/vagas/:id', vagaController.atualizarVaga);
router.delete('/vagas/:id', vagaController.excluirVaga);


module.exports = router;
