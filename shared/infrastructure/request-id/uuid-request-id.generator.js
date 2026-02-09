const { randomUUID } = require('crypto');
const RequestIdGenerator = require('../../domain/request-id-generator');

class UuidRequestIdGenerator extends RequestIdGenerator {
  generate() {
    return randomUUID();
  }
}

module.exports = UuidRequestIdGenerator;
