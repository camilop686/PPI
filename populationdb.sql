CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(60),
    fecha_registro DATE,
    correo VARCHAR(100)
);

CREATE TABLE virus (
    id_virus SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    tipo VARCHAR(50)
);

CREATE TABLE administrador (
    id_admin SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    rol VARCHAR(50)
);

CREATE TABLE informacion (
    id_info SERIAL PRIMARY KEY,
    titulo VARCHAR(100),
    contenido TEXT,
    id_admin INT REFERENCES administrador(id_admin)
);

CREATE TABLE comentario (
    id_comentario SERIAL PRIMARY KEY,
    contenido TEXT,
    id_usuario INT REFERENCES usuario(id_usuario)
);

-- =====================================
-- INSERTS USUARIO
-- =====================================

INSERT INTO usuario (nombre, fecha_registro, correo) VALUES
('Juan Perez','2025-01-01','juan@gmail.com'),
('Maria Gomez','2025-01-02','maria@gmail.com'),
('Carlos Ruiz','2025-01-03','carlos@gmail.com'),
('Laura Torres','2025-01-04','laura@gmail.com'),
('Andres Gil','2025-01-05','andres@gmail.com'),
('Valentina Mora','2025-01-06','valentina@gmail.com'),
('Sofia Restrepo','2025-01-07','sofia@gmail.com'),
('Mateo Lopez','2025-01-08','mateo@gmail.com'),
('Camila Diaz','2025-01-09','camila@gmail.com'),
('Daniel Vega','2025-01-10','daniel@gmail.com');

-- =====================================
-- INSERTS VIRUS
-- =====================================

INSERT INTO virus (nombre, tipo) VALUES
('WannaCry','Ransomware'),
('Zeus','Spyware'),
('ILoveYou','Gusano'),
('Conficker','Gusano'),
('CryptoLocker','Ransomware'),
('Stuxnet','Malware'),
('Emotet','Troyano'),
('Mydoom','Gusano'),
('DarkComet','RAT'),
('KeyLoggerX','Keylogger');

-- =====================================
-- INSERTS ADMINISTRADOR
-- =====================================

INSERT INTO administrador (nombre, rol) VALUES
('Camilo','Administrador General'),
('Ronald','Administrador General'),
('Ana','Moderador'),
('Carlos','Moderador'),
('Juliana','Supervisor'),
('Miguel','Soporte'),
('Valeria','Soporte'),
('David','Editor'),
('Natalia','Editor'),
('Sebastian','Supervisor');

-- =====================================
-- INSERTS INFORMACION
-- =====================================

INSERT INTO informacion (titulo, contenido, id_admin) VALUES
('Que es un virus','Programa malicioso que afecta dispositivos',1),
('Evitar malware','Descargar solo desde sitios seguros',2),
('Uso de antivirus','Mantener el antivirus actualizado',3),
('Phishing','No abrir enlaces sospechosos',4),
('Seguridad WiFi','Evitar redes publicas inseguras',5),
('Contraseñas seguras','Usar claves complejas y unicas',6),
('Copias de seguridad','Realizar respaldos frecuentes',7),
('Actualizaciones','Mantener el sistema actualizado',8),
('Proteccion web','Verificar certificados HTTPS',9),
('Seguridad digital','Aplicar buenas practicas de seguridad',10);

-- =====================================
-- INSERTS COMENTARIO
-- =====================================

INSERT INTO comentario (contenido, id_usuario) VALUES
('Muy buena informacion',1),
('Me ayudo bastante',2),
('Excelente consejo',3),
('No conocia ese virus',4),
('Gracias por compartir',5),
('Funciona perfectamente',6),
('Muy util para estudiantes',7),
('Aprendi mucho',8),
('Seguire las recomendaciones',9),
('Buen trabajo',10);

-- =====================================
-- SELECTS
-- =====================================

SELECT * FROM usuario;
SELECT * FROM administrador;
SELECT * FROM virus;
SELECT * FROM informacion;
SELECT * FROM comentario;

-- =====================================
-- UPDATES
-- =====================================

UPDATE usuario
SET nombre = 'Juan Camilo Perez'
WHERE id_usuario = 1;

UPDATE administrador
SET rol = 'Administrador Principal'
WHERE id_admin = 1;

UPDATE virus
SET tipo = 'Malware Avanzado'
WHERE id_virus = 1;

UPDATE informacion
SET titulo = '¿Que es un virus informatico?'
WHERE id_info = 1;

UPDATE comentario
SET contenido = 'Informacion muy util para todos'
WHERE id_comentario = 1;

-- =====================================
-- DELETES
-- =====================================

DELETE FROM comentario
WHERE id_comentario = 10;

DELETE FROM informacion
WHERE id_info = 10;

DELETE FROM virus
WHERE id_virus = 10;

DELETE FROM administrador
WHERE id_admin = 10;

DELETE FROM usuario
WHERE id_usuario = 10;