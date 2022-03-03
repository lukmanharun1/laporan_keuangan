const express = require('express');
const app = express();
require('dotenv').config();
const logger = require('morgan');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || '3000';
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
})
