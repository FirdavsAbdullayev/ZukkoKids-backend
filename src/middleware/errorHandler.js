/**
 * Markazlashtirilgan xato handler.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details,
    });
  }

  // Sequelize validation xatolari
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: "Ma'lumotlar validatsiyadan o'tmadi",
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Bu ma\'lumot allaqachon mavjud',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: "Bog'liq ma'lumot topilmadi (foreign key xatosi)",
    });
  }

  // PostgreSQL darajadagi xatolar (masalan noto'g'ri ID formati)
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(400).json({
      success: false,
      message: "So'rov parametrlari noto'g'ri kiritilgan",
    });
  }

  if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
    console.error('💥 Bazaga ulanib bo\'lmadi:', err);
    return res.status(503).json({
      success: false,
      message: "Baza bilan aloqa uzilgan. Keyinroq urinib ko'ring.",
    });
  }

  console.error('💥 Kutilmagan xato:', err);
  return res.status(500).json({
    success: false,
    message: 'Serverda kutilmagan xatolik yuz berdi',
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint topilmadi: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { ApiError, errorHandler, notFoundHandler };
