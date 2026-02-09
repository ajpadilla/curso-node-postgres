function createRequestIdMiddleware({ requestIdGenerator }) {
  function requestId(req, res, next) {
    const id = requestIdGenerator.generate();

    req.requestId = id;
    res.setHeader('X-Request-Id', id);

    next();
  }

  return { requestId };
}

module.exports = createRequestIdMiddleware;
