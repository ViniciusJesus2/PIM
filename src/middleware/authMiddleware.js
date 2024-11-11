// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.error("Token não encontrado.");
        return res.sendStatus(401); // Não autorizado
    }

    // Verifica o token com a chave secreta do ambiente
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Erro de autenticação:", err);
            return res.sendStatus(403); // Proibido
        }
        req.user = user;
        next();
    });
};

// Middleware de autenticação
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId; // Passa o ID do usuário para o próximo middleware
      next(); // Se o token for válido, continua para o controller
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
  };

module.exports = authenticateToken;
