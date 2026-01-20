// interfaces/http/error-mapper.js
const boom = require('@hapi/boom');

const httpErrorMapper = (error) => {
  if (typeof error.toHttp !== 'function') {
    return boom.internal('Unexpected error');
  }

  const { status, message } = error.toHttp();

  switch (status) {
    case 400: return boom.badRequest(message);
    case 401: return boom.unauthorized(message);
    case 403: return boom.forbidden(message);
    case 404: return boom.notFound(message);
    case 409: return boom.conflict(message);
    default:  return boom.internal(message);
  }
};

module.exports = { httpErrorMapper };
