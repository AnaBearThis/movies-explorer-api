const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new Error('Запрашиваемая страница не найдена');
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPass) => {
      User.create({
        name,
        email,
        password: hashedPass,
      })
        .then((user) => {
          res.status(201).send(user);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new Error('Неверные данные пользователя');
    })
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (isValid) {
            const jwt = jsonWebToken.sign({
              _id: user._id,
            // eslint-disable-next-line dot-notation
            }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
            console.log(JWT_SECRET);
            res.cookie('jwt', jwt, {
              maxAge: 604800000,
              httpOnly: true,
              sameSite: true,
            });
            res.send(user);
          } else {
            throw new Error('Неверные данные пользователя');
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  console.log(name);
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new Error('Запрашиваемая страница не найдена');
      } else {
        res.send(user);
      }
    })
    .catch(next);
};
