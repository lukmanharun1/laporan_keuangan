const { validationResult } = require('express-validator');
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.destination) {
            // hapus file terlebih dahulu
            const hapusFile = require('../helper/hapus_file');
            hapusFile(req.destination);
        }
        const response = require('../helper/response');
        return response(res, { errors }, 400);
    }
    return next();
}

module.exports = validate;