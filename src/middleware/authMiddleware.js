// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Obtém o token do cabeçalho Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // 'Bearer <token>'

    // Verifica se o token está presente
    if (!token) {
        console.error("Token não encontrado.");
        return res.status(401).json({ message: 'Token não fornecido.' }); // Não autorizado
    }

    // Verifica o token com a chave secreta
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Erro de autenticação:", err);
            return res.status(403).json({ message: 'Token inválido ou expirado.' }); // Proibido
        }

        // Passa os dados do usuário decodificados para a próxima rota
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
