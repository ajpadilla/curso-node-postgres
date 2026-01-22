# Add New User - Notes

- Truncate the `User` table before running integration tests to avoid duplicate email errors:
  ```js
  await User.destroy({ where: {}, truncate: true, cascade: true });
