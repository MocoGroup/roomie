-- Cria os tipos customizados antes do Hibernate gerar as tabelas
-- Nota: sem IF NOT EXISTS pois o ScriptUtils do Spring nao suporta dollar-quoting ($$)
-- e o banco de testes e sempre criado do zero (create-drop)
CREATE TYPE tipo_genero AS ENUM ('MALE', 'FEMALE', 'OTHER', 'MIXED');
CREATE TYPE user_role AS ENUM ('ADMIN', 'USER');
CREATE TYPE tipo_imovel AS ENUM ('HOUSE', 'APARTMENT', 'STUDIO', 'ROOM', 'DORMITORY');
CREATE TYPE status_anuncio AS ENUM ('DRAFT', 'ACTIVE', 'RENTED');
