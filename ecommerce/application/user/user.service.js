const NotFoundError = require('./errors/notfound.error');
const ApplicationError = require('../errors/application.error');
const ConflictError = require('./errors/conflict.error');
const ValidationError = require('./errors/validation.error');

class UserService {
  constructor({ userRepository, passwordHasher }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async create(data) {
    if (!data.email) {
      throw new ValidationError('Email is required');
    }

    const userFound = await this.userRepository.findByEmail(data.email);

    if (userFound?.email === data.email) {
      throw new ConflictError('Email already registered');
    }

    if (!this.passwordHasher) {
      throw new ApplicationError('Password hasher not configured');
    }

    const hash = await this.passwordHasher.hash(data.password);

    const user = await this.userRepository.create({
      ...data,
      password: hash,
    });

    delete user.password;
    return user;
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(id) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async findByEmail(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async update(id, changes) {
    const user = await this.userRepository.findByEmail(changes.email);

    if (user.email === changes.email) {
      throw new ConflictError('Email already registered');
    }

    const updated = await this.userRepository.update(id, changes);

    if (!updated) {
      throw new NotFoundError('User not found');
    }

    return updated;
  }

  async delete(id) {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('User not found');
    }
    return deleted;
  }
}

module.exports = UserService;
