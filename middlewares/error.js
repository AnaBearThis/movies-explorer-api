const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');

class WrongData extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 400;
    this.message = 'Неверные данные';
  }
}

class AuthErr extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 401;
    this.message = 'Неверные данные пользователя';
  }
}

class NotEnoughRights extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 403;
    this.message = 'Недостаточно прав для этого действия';
  }
}

class NotFound extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 404;
    this.message = 'Запрашиваемая страница не найдена';
  }
}

class NotUniqueEmail extends Error {
  constructor(err) {
    super(err);
    this.statusCode = 409;
    this.message = 'Пользователь с таким email уже зарегистрирован';
  }
}

const errorHandler = (err, req, res, next) => {
  let error;
  console.log(err);

  if (err instanceof mongoose.Error.ValidationError) {
    error = new WrongData(err);
  } else if (err instanceof mongoose.Error.DocumentNotFoundError || err.message === 'Запрашиваемая страница не найдена') {
    error = new NotFound(err);
  } else if (err.message === 'Неверные данные пользователя') {
    error = new AuthErr(err);
  } else if (err instanceof jwt.JsonWebTokenError) {
    error = new AuthErr(err);
  } else if (err.code === 11000) {
    error = new NotUniqueEmail(err);
  } else if (err.message === 'Недостаточно прав') {
    error = new NotEnoughRights(err);
  } else {
    res.status(500).send({ message: 'Произошла ошибка сервера' });
  }

  res.status(error.statusCode).send({ message: error.message });

  next();
};

module.exports = errorHandler;
