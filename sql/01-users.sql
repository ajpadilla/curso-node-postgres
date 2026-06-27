INSERT INTO users
(email, password, role, create_at)
VALUES
('john@example.com', 'hash1', 'customer', NOW()),
('mary@example.com', 'hash2', 'customer', NOW()),
('alice@example.com', 'hash3', 'admin', NOW()),
('bob@example.com', 'hash4', 'customer', NOW()),
('carol@example.com', 'hash5', 'customer', NOW());
