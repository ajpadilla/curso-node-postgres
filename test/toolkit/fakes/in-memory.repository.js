const UserRepository = require('../../../ecommerce/domain/user/repositories/user.repository');
const InMemoryStore = require('./in-memory.store');

class InMemoryUserRepository extends UserRepository {
  constructor({ users = [] } = {}) {
    super();
    this.store = new InMemoryStore(users);
  }

  async create(userData) {
    return this.store.create(userData);
  }

  async findAll() {
    return this.store.findAll();
  }

  async findById(id) {
    return this.store.findById(id);
  }

  async findByEmail(email) {
    return this.store.findOneBy({ email });
  }

  async update(id, changes) {
    return this.store.update(id, changes);
  }

  async delete(id) {
    return this.store.delete(id);
  }
}

module.exports = InMemoryUserRepository;
