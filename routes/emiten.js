const express = require('express')
const router = express.Router();

const controller = require('../controller/emiten');
const validate = require('../middleware/validate');
const validation = require('../validation/emiten');

router.get('/', validation.getAll(), validate, controller.getAll);
router.post('/', validation.create(), validate, controller.create);
router.put('/:id', validation.update(), validate, controller.update);

module.exports = router;