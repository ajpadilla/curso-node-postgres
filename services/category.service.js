const boom = require('@hapi/boom');

const { sequelize } = require('../libs/sequelize');

class CategoryService {

  constructor(){
  }
  async create(data) {
    return sequelize.models.Category.create(data);
  }

  async find() {
    return await sequelize.models.Category.findAll();
  }

  async findOne(id) {
    return await  sequelize.models.Category.findByPk(id, {
      include: ['products']
    });
  }

  async update(id, changes) {
    return {
      id,
      changes,
    };
  }

  async delete(id) {
    return { id };
  }

}

module.exports = CategoryService;
