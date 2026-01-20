const UserRepository = require('../../../domains/users/repositories/user.repository');
const { sequelize } = require('../../../../database/sequelize');

class SequelizeUserRepository extends UserRepository {
  async create(data) {
    return await sequelize.models.User.create(data);
  }

  async findAll() {
    return await sequelize.models.User.findAll({
      include: ['customer']
    });
  }

  async findById(id) {
    return await sequelize.models.User.findByPk(id);
  }

  async findByEmail(email) {
    return await sequelize.models.User.findOne({
      where: { email }
    });
  }

  async update(id, changes) {
    const user = await this.findById(id);
    if (!user) return null;
    return await user.update(changes);
  }

  async delete(id) {
    const user = await this.findById(id);
    if (!user) return null;
    await user.destroy();
    return { id };
  }
}

module.exports = SequelizeUserRepository;
