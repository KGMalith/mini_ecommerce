const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();

//import routes
const productRoute = require('./routes/products');
const usersRoute = require('./routes/users');
const orderRoute = require('./routes/orders');



app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//project routes
app.use('/api/products', productRoute);
app.use('/api/users', usersRoute);
app.use('/api/orders', orderRoute);

module.exports = app;
