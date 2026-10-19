CREATE DATABASE IF NOT EXISTS todo_db;
USE todo_db;

CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    type ENUM('personal', 'shared') NOT NULL DEFAULT 'personal',
    status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
    attachment VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dummy Data
INSERT INTO todos (title, description, type, status, attachment) VALUES
('Selesaikan Tugas E04 Webprog', 'Membuat Todo App modular dengan PHP dan MySQL', 'personal', 'pending', NULL),
('Rapat Tim Proyek', 'Membahas pembagian tugas proyek kelompok', 'shared', 'pending', NULL),
('Beli Bahan Makanan', 'Beli telur, susu, dan roti', 'personal', 'completed', NULL);