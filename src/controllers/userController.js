const { User, TypeUser, UserProfissionalProfile, UserEmpresaProfile } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Lógica de Criar Usuario
const createUser = async (req, res) => {
  const { name, email, password, cpf_cnpj, type_user_id } = req.body;

  try {
    // Verificar se todos os campos obrigatórios estão presentes
    if (!name || !email || !password || !cpf_cnpj || !type_user_id) {
      console.log('Erro: Campos obrigatórios faltando.');
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    console.log('Campos obrigatórios verificados com sucesso.');

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Senha criptografada com sucesso.');

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      cpf_cnpj,
      type_user_id,
    });
    console.log(`Usuário criado com sucesso: ${user.name} (ID: ${user.id})`);

    // Resposta bem-sucedida
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
    console.log('Resposta enviada: Usuário criado com sucesso.');

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);

    // Verificando erro de chave estrangeira
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      console.log('Erro de chave estrangeira: user_id não encontrado.');
      return res.status(400).json({ message: 'Erro de chave estrangeira, user_id não encontrado.' });
    }

    // Caso seja um erro de validação do Sequelize
    if (error instanceof Sequelize.ValidationError) {
      console.log('Erro de validação detectado.');
      return res.status(400).json({ message: 'Erro de validação', details: error.errors });
    }

    // Para erros gerais
    console.log('Erro geral no processo de criação do usuário.');
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
};

// Lógica para login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o email existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('Erro: Usuário não encontrado.');
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    console.log(`Usuário encontrado: ${user.name} (ID: ${user.id})`);

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Erro: Senha incorreta.');
      return res.status(400).json({ message: 'Senha incorreta.' });
    }
    console.log('Senha verificada com sucesso.');

    // Gerar o token JWT com a chave secreta do ambiente
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token JWT gerado com sucesso.');

    // Verificar o perfil do usuário
    let userProfile = null;
    if (user.type_user_id === 3) { // Profissional
      userProfile = await UserProfissionalProfile.findOne({ where: { user_id: user.id } });
      console.log('Perfil de profissional carregado com sucesso.');
    } else if (user.type_user_id === 2) { // Empresa
      userProfile = await UserEmpresaProfile.findOne({ where: { user_id: user.id } });
      console.log('Perfil de empresa carregado com sucesso.');
    }

    // Responder com os dados do usuário e o token
    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type_user_id: user.type_user_id,
        profile: userProfile,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

// Função para carregar o perfil do usuário
const getUserProfile = async (req, res) => {
  try {
    // Verificar se o token foi passado na requisição
    const token = req.headers['authorization']?.split(' ')[1]; // Token no formato Bearer <token>
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    // Verificar a validade do token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Substitua por sua chave secreta
    const userId = decoded.userId; // A chave 'userId' é decodificada do token

    // Buscar o usuário com o id do token e carregar o perfil
    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: UserProfissionalProfile,
          required: false, // Um usuário pode não ter um perfil profissional
          attributes: ['id', 'nome_completo', 'data_nascimento', 'localizacao', 'contato', 'especializacao', 'resumo', 'avatar', 'redes_sociais', 'link_curriculo']
        },
        {
          model: UserEmpresaProfile,
          required: false, // Um usuário pode não ter um perfil de empresa
          attributes: ['id', 'nome_completo', 'localizacao', 'contato', 'resumo', 'avatar', 'redes_sociais']
        },
      ],
    });

    // Verificar se o usuário foi encontrado
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar qual perfil o usuário tem (profissional ou de empresa) e montar a resposta
    const userProfile = user.type_user_id === 3 ? user.UserProfissionalProfile : user.UserEmpresaProfile;

    // Retornar os dados do usuário com o perfil
    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: userProfile, // Perfil do usuário (Profissional ou Empresa)
      },
    });
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    return res.status(500).json({ message: 'Erro ao carregar o perfil.' });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserProfile
};