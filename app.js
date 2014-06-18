var express     = require('express');
var app         = express();
var path        = require('path');
var favicon     = require('static-favicon');
var logger      = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser  = require('body-parser');
var swig        = require('swig');
var mongoose    = require('mongoose');
var passport    = require('passport');
var flash       = require('connect-flash');
var session     = require('express-session');
var configDB    = require('./config/database.js');


// configuration
mongoose.connect(configDB.url);
require('./config/passport')(passport);


// Template engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
require('./routes/routes.js')(app, passport);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
