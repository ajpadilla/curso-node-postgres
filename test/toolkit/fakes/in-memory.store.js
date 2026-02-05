const { faker } = require('@faker-js/faker');

class InMemoryStore {
  constructor(initialData = []) {
    this.items = [...initialData];
  }

  findAll() {
    return this.items;
  }

  findById(id) {
    return this.items.find((item) => item.id === id) || null;
  }

  findOneBy(query) {
    return (
      this.items.find((item) =>
        Object.entries(query).every(([key, value]) => item[key] === value),
      ) || null
    );
  }

  create(data) {
    const entity = {
      id: faker.datatype.uuid(),
      ...data,
    };

    this.items.push(entity);
    return entity;
  }

  update(id, changes) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    this.items[index] = {
      ...this.items[index],
      ...changes,
    };

    return this.items[index];
  }

  delete(id) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const [removed] = this.items.splice(index, 1);
    return removed;
  }
}

module.exports = InMemoryStore;
