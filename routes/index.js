const express = require('express')
const router = express.Router();

const emiten = require('./emiten');

router.use('/emiten', emiten);
module.exports = router;