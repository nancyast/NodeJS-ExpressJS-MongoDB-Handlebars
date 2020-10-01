var mongoose = require('mongoose');
// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var fs = require('fs');
var methodOverride = require('method-override');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');

const errorController = require('./controllers/error');

var handlebars = require('express-handlebars');

var app = express();

mongoose
  .connect(
    'mongodb+srv://nhungast:H00ngNhung@cluster0-k13ut.mongodb.net/natours?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('DB connect successfully!');
  });

// view engine setup
app.engine(
  '.hbs',
  handlebars({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
  })
);

app.set('view engine', '.hbs');

app.set('views', __dirname + '/views/');

// // register Partials
// var rawTemplate = fs.readFileSync(
//   __dirname + '/views/partials/sidebar.hbs',
//   'utf8'
// );
// hbs.registerPartial('sidebar', rawTemplate);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('method'));

app.use('/', indexRouter); // dashboard
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);

app.all('*', (req, res, next) => {
  res.render('404page');
});

app.use(errorController);

module.exports = app;

// Summary
// Use gzip compressing to minify response size: Express compress for JSON
// Should wait for db connection before creating HTTP server
// Controler should be thin, has validation (https://github.com/hapijs/joi), handle all cases, should RETURN SOON
// Error handling
// Single Responsibily princinple....
