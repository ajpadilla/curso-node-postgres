// src/application/auth/AuthService.js
const UnauthorizedError = require('./errors/UnauthorizedError');

class AuthService {
  constructor({ userRepository, passwordHasher, tokenService, mailer }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
    this.mailer = mailer;
  }

  async authenticate(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError();
    }

    const valid = await this.passwordHasher.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedError();
    }

    return user;
  }

  signToken(user) {
    return this.tokenService.sign({
      sub: user.id,
      role: user.role,
    });
  }
}

module.exports = AuthService;
