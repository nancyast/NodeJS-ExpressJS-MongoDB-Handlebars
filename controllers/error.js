const sendErrorDev = (err, res) => {
  res.render('error', {
    error: {
      message: err.message,
      status: err.status,
      stack: err.stack,
    },
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.render('error', {
      error: {
        message: err.message,
        status: err.status,
      },
    });
  } else {
    console.log('ERROR ', err);
    res.render('error', {
      error: {
        message: 'Something went wrong',
        status: 500,
      },
    });
  }
};

const errorController = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') {
      // TODO handle error from mongodb
    }
    sendErrorProd(err, res);
  }
};

module.exports = errorController;
