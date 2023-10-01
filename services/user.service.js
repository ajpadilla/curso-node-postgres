const boom = require('@hapi/boom');

//const { getConnection } = require('../libs/postgres.js');
const { sequelize } = require('./../libs/sequelize');
const bcrypt = require("bcrypt");


class UserService {
  constructor() {}

  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await sequelize.models.User.create({
      ...data,
      password: hash
    });
    delete newUser.dataValues.password;
    return newUser;
  }

  async find() {
    /*const client = await getConnection();
    const response = await client.query('SELECT * FROM tasks');*/
    const newUser = await sequelize.models.User.findAll({
      include: ['customer']
    });
    delete newUser.dataValues.password;
    return newUser;
  }

  async findByEmail(email) {
    return await sequelize.models.User.findOne({
      where: {email}
    });
  }

  async findOne(id) {
    const user = await sequelize.models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    return await user.update(changes);
  }

  async delete(id) {
    const user = await sequelize.models.User.findByPk(id);
    await user.destroy(id);
    return { id };
  }
}

module.exports = UserService;
