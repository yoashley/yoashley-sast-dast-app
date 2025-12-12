var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var articlesRouter = require('./routes/articles');

var app = express();

// ----- Puerto por defecto -----
app.set('port', process.env.PORT || 3000);

// ----- Configuración de sesiones -----
app.use(session({
  secret: 'mi_super_secreto_seguro_123',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// ----- Motor de vistas -----
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ----- Middleware para currentUser y mensajes + req.flash fake -----
app.use(function (req, res, next) {
  // mensajes disponibles para las vistas
  if (!res.locals.messages) {
    res.locals.messages = {};
  }

  // usuario actual (si lo guardas en sesión)
  res.locals.currentUser = req.session.user || null;

  // stub de req.flash para evitar errores en routes/auth.js
  req.flash = function (type, msg) {
    if (!type || !msg) return;
    if (!res.locals.messages[type]) {
      res.locals.messages[type] = [];
    }
    res.locals.messages[type].push(msg);
  };

  next();
});

// ----- Rutas -----
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/articles', articlesRouter);

// ----- 404 -----
app.use(function (req, res, next) {
  next(createError(404));
});

// ----- Manejo de errores -----
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('pages/error');
});

module.exports = app;

