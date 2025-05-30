const express = require('express');
const createHttpError = require('http-errors');

const authRoute = require('./routes/authRoutes');

// to parse NUMERIC types for pg-node
// https://github.com/brianc/node-postgres/issues/811
const types = require('pg').types
types.setTypeParser(1700, function(val) {
    return parseFloat(val);
});

const app = express();
app.use(express.json()); // to process JSON in request body


app.use(express.static('client'));

app.use('/auth', authRoute);

app.use(function (req, res, next) {
    return next(createHttpError(404, `Unknown Resource ${req.method} ${req.originalUrl}`));
});

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    return res.status(err.status || 500).json({ error: err.message || 'Unknown Server Error!' });
});

module.exports = app;
