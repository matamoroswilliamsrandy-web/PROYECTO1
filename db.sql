-- Crear base de datos
CREATE DATABASE IF NOT EXISTS institucional_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE institucional_db;

-- Tabla de Usuarios (Solo Director)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Noticias
CREATE TABLE IF NOT EXISTS noticias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    imagen VARCHAR(255),
    fecha_publicacion DATE DEFAULT (CURRENT_DATE), -- Fixed DATA to DATE and wrapped CURRENT_DATE
    destacada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Eventos
CREATE TABLE IF NOT EXISTS eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_evento DATE NOT NULL,
    lugar VARCHAR(255),
    imagen VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Autoridades
CREATE TABLE IF NOT EXISTS autoridades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    imagen VARCHAR(255),
    orden INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Galería
CREATE TABLE IF NOT EXISTS galeria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100),
    imagen VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Contacto (Mensajes)
CREATE TABLE IF NOT EXISTS contacto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    asunto VARCHAR(150),
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario Director por defecto (password: admin123)
-- El password debe ser hasheado con bcrypt manualmente o mediante un script de inicialización.
-- Aquí insertamos un placeholder que DEBE ser actualizado.
INSERT INTO usuarios (username, password) VALUES ('admin', '$2b$10$X7V.j5t6r7u8v9w0x1y2z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P'); 

-- Tabla de Ajustes de Inicio (Clave-Valor)
CREATE TABLE IF NOT EXISTS ajustes_inicio (
    clave VARCHAR(100) PRIMARY KEY,
    valor TEXT NOT NULL
);
