const { faker } = require('@faker-js/faker');


class UserBuilder {

  constructor() {
    this.user  = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }

  withEmail(email) {
    this.user.email = email;
    return this;
  }

  withPassword(password) {
    this.user.password = password;
    return this;
  }

  build() {
    return { ...this.user };
  }

  static aUser() {
    return new UserBuilder();
  }

}

module.exports = UserBuilder;
