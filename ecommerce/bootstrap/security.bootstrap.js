const BcryptPasswordHasher = require('../infrastructure/security/bcrypt.password-hasher');
const JwtTokenService = require('../infrastructure/security/jwt.token.service');
const NodemailerMailer = require('../infrastructure/mail/node.mailer.mailer');

module.exports = function bootstrapSecurity() {
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(process.env.JWT_SECRET);

  const mailer = new NodemailerMailer({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return {
    passwordHasher,
    tokenService,
    mailer,
  };
};
