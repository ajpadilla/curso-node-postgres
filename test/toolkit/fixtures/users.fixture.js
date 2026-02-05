const UserBuilder = require('../builders/user.builder');

module.exports = (count = 1) => Array.from({ length: count }, () => UserBuilder.aUser().build());
