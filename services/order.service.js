const boom = require('@hapi/boom');

const { sequelize } = require('../libs/sequelize');

class OrderService {

  constructor(){
  }
  async create(data) {
    return sequelize.models.Order.create(data);
  }

  async addItem(data) {
    return sequelize.models.OrderProduct.create(data);
  }

  async find() {
    return [];
  }
  async findByUser(userId) {
    const orders = await sequelize.models.Order.findAll({
      where: {
        '$customer.user.id$': userId
      },
      include: [
        {
          association: 'customer',
          include: ['user']
        }
      ]
    });
    return orders;
  }

  async findOne(id) {
    return await sequelize.models.Order.findByPk(id, {
      include: [
        {
          association: 'customer',
          include: ['user']
        },
        'items'
      ]
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

module.exports = OrderService;
