module.exports = (res, object, httpCode = 200) => {
  return res.status(httpCode).json(object);
}