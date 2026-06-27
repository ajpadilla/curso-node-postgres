-- 1. known users (safe FK mapping)
INSERT INTO login_attempts
(user_id, email, success, ip_address, response_time_ms, created_at)

SELECT
  u.id,
  v.email,
  v.success,
  v.ip_address,
  FLOOR(random()*500+50),
  NOW()
FROM users u
JOIN (
  VALUES
    ('john@example.com', true,  '192.168.1.10'),
    ('john@example.com', false, '192.168.1.10'),
    ('john@example.com', false, '192.168.1.10'),

    ('mary@example.com', true,  '192.168.1.20'),
    ('mary@example.com', false, '192.168.1.20'),

    ('alice@example.com', true, '192.168.1.30')
) v(email, success, ip_address)
ON u.email = v.email;


-- 2. unknown user (no FK relation)
INSERT INTO login_attempts
(user_id, email, success, ip_address, created_at)
VALUES
(NULL, 'unknown@example.com', false, '10.0.0.1', NOW());


