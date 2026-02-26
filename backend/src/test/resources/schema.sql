-- Cria os tipos customizados antes do Hibernate gerar as tabelas
CREATE TYPE IF NOT EXISTS tipo_genero AS ENUM ('MALE', 'FEMALE', 'OTHER', 'MIXED');
CREATE TYPE IF NOT EXISTS user_role AS ENUM ('ADMIN', 'USER');
CREATE TYPE IF NOT EXISTS tipo_imovel AS ENUM ('HOUSE', 'APARTMENT', 'STUDIO', 'ROOM', 'DORMITORY');
CREATE TYPE IF NOT EXISTS status_anuncio AS ENUM ('DRAFT', 'ACTIVE', 'RENTED');
