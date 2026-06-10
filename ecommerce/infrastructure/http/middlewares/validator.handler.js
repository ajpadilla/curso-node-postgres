const ValidationError = require('../../../application/user/errors/validation.error');

function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property];

    const { error } = schema.validate(data, {
      abortEarly: false, // 🔥 collect all errors
    });

    if (error) {
      const message = error.details.map((err) => err.message).join('. ');

      // ✅ Convert to your domain error
      return next(new ValidationError(message));
    }

    next();
  };
}

module.exports = validatorHandler;
