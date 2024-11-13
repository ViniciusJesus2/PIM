create database pim character set utf8mb4 collate utf8mb4_unicode_ci;

CREATE TABLE Users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(20) UNIQUE,
    type_user_id INT NOT NULL, -- Identifica o tipo de usuário (ex: Profissional, Empresa)
    logo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL -- Para soft delete
);

CREATE TABLE user_profissional_profile (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- Chave estrangeira que referencia o usuário
    nome_completo VARCHAR(255),
    data_nascimento DATE,
    localizacao VARCHAR(255),
    contato VARCHAR(255),
    especializacao VARCHAR(255),
    resumo TEXT,
    avatar VARCHAR(255),
    redes_sociais JSON, -- Armazena as redes sociais em formato JSON
    link_curriculo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL, -- Para soft delete
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE user_empresa_profile (
  id INT AUTO_INCREMENT PRIMARY KEY,      
  user_id INT NOT NULL,                   
  nome_completo VARCHAR(255) NOT NULL,    
  localizacao VARCHAR(255),               
  contato VARCHAR(255),                   
  resumo TEXT,                            
  avatar VARCHAR(255),                    
  redes_sociais JSON,                     
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
  deleted_at TIMESTAMP NULL,              
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE  
);

ALTER TABLE user_empresa_profile MODIFY avatar LONGTEXT;

ALTER TABLE user_profissional_profile MODIFY avatar LONGTEXT;


-- Trigger para preencher automaticamente o perfil de profissional
DELIMITER $$

CREATE TRIGGER trg_fill_professional_profile
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.type_user_id = (SELECT id FROM type_user WHERE type_name = 'profissional') THEN
        INSERT INTO user_profissional_profile (
            user_id, 
            nome_completo, 
            data_nascimento, 
            localizacao, 
            contato, 
            especializacao, 
            resumo, 
            avatar, 
            redes_sociais, 
            link_curriculo,
            created_at, 
            updated_at
        ) VALUES (
            NEW.id, 
            NEW.name, 
            '1990-01-01', 
            'Localização Padrão', 
            'Contato Padrão', 
            'Especialização Padrão', 
            'Resumo padrão do profissional', 
            'avatar_padrao.png', 
            JSON_OBJECT('linkedin', '', 'github', ''), 
            'link_curriculo_padrao.pdf',
            NOW(), 
            NOW()
        );
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_fill_company_profile
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.type_user_id = (SELECT id FROM type_user WHERE type_name = 'empresa') THEN
        INSERT INTO user_empresa_profile (
            user_id, 
            nome_completo, 
            localizacao, 
            contato, 
            resumo, 
            avatar, 
            redes_sociais, 
            created_at, 
            updated_at
        ) VALUES (
            NEW.id, 
            NEW.name, 
            'Localização da Empresa Padrão', 
            'Contato da Empresa Padrão', 
            'Resumo padrão da empresa', 
            'avatar_empresa_padrao.png', 
            JSON_OBJECT('linkedin', '', 'site', ''), 
            NOW(), 
            NOW()
        );
    END IF;
END$$

DELIMITER;

-- Criação de vaga
CREATE TABLE vagas (
    vaga_id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    empresa_id INT NOT NULL, -- ID da empresa que criou a vaga
    empresa_nome VARCHAR(255) NOT NULL, -- Nome da empresa
    localizacao VARCHAR(255), 
    salario DECIMAL(10, 2), 
    tipo_contrato ENUM('CLT', 'PJ', 'Freelancer', 'Estágio') NOT NULL,
    nivel_experiencia ENUM('Júnior', 'Pleno', 'Sênior') NOT NULL,
    status ENUM('Aberta', 'Fechada') DEFAULT 'Aberta',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (empresa_id) REFERENCES Users(id) ON DELETE CASCADE -- Relacionando a empresa à tabela Users
);

-- Inscrições a vaga
CREATE TABLE inscricoes (
    inscricao_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- ID do usuário que se inscreveu (profissional)
    vaga_id INT NOT NULL, -- ID da vaga na qual o usuário se inscreveu
    status_inscricao ENUM('em andamento', 'processo seletivo', 'encerrado', 'aprovado') DEFAULT 'em andamento',
    data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (vaga_id) REFERENCES vagas(vaga_id),
    UNIQUE (user_id, vaga_id), -- Garantindo que o mesmo usuário não possa se inscrever mais de uma vez na mesma vaga
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
