const response = require("../helper/response");
const { verifyTokenLogin } = require("../helper/jwt");
const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("token tidak ditemukan!");
    }
    const decodeToken = await verifyTokenLogin(token);
    req.decodeToken = decodeToken;
    next();
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
    next();
  };
};
module.exports = {
  authentication,
  role,
};
