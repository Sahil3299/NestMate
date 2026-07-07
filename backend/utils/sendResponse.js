module.exports = (res, statusCode, data, message, extra = {}) => {
  const response = { success: true, data, ...extra };
  if (message) response.message = message;
  return res.status(statusCode).json(response);
};
