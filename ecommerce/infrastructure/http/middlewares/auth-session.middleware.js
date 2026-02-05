function authSessionMiddleware(authService) {
  return function (req, res, next) {
    const token = req.cookies.access_token;

    if (!token) {
      return res.redirect('/api/v1/login');
    }

    try {
      const payload = authService.verifyToken(token);

      req.user = payload;
      next();
    } catch (error) {
      return res.redirect('/api/v1/login');
    }
  };
}

module.exports = authSessionMiddleware;
