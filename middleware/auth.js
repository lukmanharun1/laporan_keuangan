const response = require("../helper/response");
const { verifyTokenLogin } = require("../helper/jwt");
const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw {
        message: "token tidak ditemukan!",
      };
    }
    const decodeToken = await verifyTokenLogin(token);
    req.decodeToken = decodeToken;
    return next();
  } catch (error) {
    return response(
      res,
      {
        status: "error",
        message: error.message,
      },
      400
    );
  }
};

const role = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.decodeToken.role)) {
      return response(
        res,
        {
          status: "error",
          message: "Maaf anda tidak memiliki akses!",
        },
        403
      );
    }
    return next();
  };
};
module.exports = {
  authentication,
  role,
};
