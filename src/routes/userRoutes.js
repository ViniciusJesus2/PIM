const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware'); 

router.post('/cadastro', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/profile', userController.getUserProfile);

  
module.exports = router;
