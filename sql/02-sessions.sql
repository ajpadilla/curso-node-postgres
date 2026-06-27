INSERT INTO sessions (user_id, refresh_token, created_at, expires_at)
SELECT
  u.id,
  v.token,
  NOW(),
  NOW() + INTERVAL '7 days'
FROM users u
JOIN (
  VALUES
    ('john@example.com', 'token-1'),
    ('mary@example.com', 'token-2'),
    ('alice@example.com', 'token-3'),
    ('bob@example.com', 'token-4'),
    ('john@example.com', 'token-5'),
    ('mary@example.com', 'token-6')
) v(email, token)
ON u.email = v.email;
