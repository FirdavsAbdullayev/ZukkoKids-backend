const Joi = require('joi');

/**
 * Joi yordamida request body/query/params validation middleware.
 * @param {Joi.Schema} schema - Joi validation sxemasi
 * @param {'body'|'query'|'params'} source - Qaysi qismni tekshirish (default: body)
 */
const validate = (schema, source = 'body') => {
  if (!schema || typeof schema.validate !== 'function') {
    throw new Error(`[validate] Yaroqsiz Joi sxema — validatsiyalangan schema kerak. Olindi: ${schema}`);
  }
  if (!['body', 'query', 'params'].includes(source)) {
    throw new Error(`[validate] Noto'g'ri manba: "${source}". body, query yoki params bo'lishi kerak.`);
  }
  return (req, res, next) => {
    const data = req[source];
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const messages = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Ma'lumotlar noto'g'ri kiritilgan",
        errors: messages,
      });
    }

    req[source] = value;
    return next();
  };
};

module.exports = validate;
