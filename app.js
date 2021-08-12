var createError = require('http-errors');
var express = require('express');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// routes
var indexRouter = require('./routes/index');
var itemRouter = require('./routes/item');
var aboutRouter = require('./routes/about');
var resumeRouter = require('./routes/resume');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//set up logger to write to console and file
app.use(logger('dev'));
app.use(logger('tiny', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'))
}));

// add a JSON parser
app.use(express.json());

// add other libraries
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// enable static routing
app.use(express.static(path.join(__dirname, 'public')));

// enable routes
app.use('/', indexRouter);
app.use('/item', itemRouter);
app.use('/about', aboutRouter);
app.use('/resume', resumeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
