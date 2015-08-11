var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override'); // para transformar POST en PUT encapsulándolo
var session = require('express-session');

var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded()); // para recoger correctamente los parámetros de pregunta respuesta
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015')); // codificación aleatoria de cookies
app.use(session());
app.use(methodOverride('_method')); // mira si hay encapsulamiento en los querys de la acción
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos:
app.use(function(req, res, next){
    // Guardar path de la solicitud en session.redir para después de login
    if(!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }
    // Hacer visible req.session en las vistas. Hacer accesible a las vistas
    res.locals.session = req.session;
    // Pasa al siguente middleware
    next();
});

// Middleware de auto-logout
app.use(function(req, res, next) {
    if (req.session.user && req.session.user.timeStamp){
        if(new Date().getTime() - req.session.user.timeStamp > 60*1000*2){
            delete req.session.user;
            req.session.logout = 'La sesión ha caducado, vuelva a iniciar sesión.';
            res.redirect(req.session.redir.toString());
        } else {
            next();
        }
    } else {
        if(req.session.user) {
            req.session.user.timeStamp = new Date().getTime();
            if(req.session.logout){
            delete req.session.logout;
        }
    }
    next();
    }
});

app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
