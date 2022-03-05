const express = require('express');
const app = express();
require('dotenv').config();
const logger = require('morgan');
const routes = require('./routes/index');
const cors = require('cors');
const helmet = require('helmet');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false, }));
app.use(helmet());
app.use(cors());
app.use(routes);

const { PORT, HOST } = process.env;
app.listen(PORT, () => {
  console.log(`app listening on http://${HOST}:${PORT}`);
})

