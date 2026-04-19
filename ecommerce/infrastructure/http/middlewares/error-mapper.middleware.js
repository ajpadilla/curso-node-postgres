const createErrorMapperMiddleware = ({ httpErrorMapper }) => {
  return (err, req, res, next) => {
    const boomError = httpErrorMapper(err);
    next(boomError);
  };
};

module.exports = createErrorMapperMiddleware;
