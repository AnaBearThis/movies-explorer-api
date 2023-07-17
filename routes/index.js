const router = require('express').Router();
const auth = require('../middlewares/auth');

const userRoutes = require('./users');
const movieRoutes = require('./movies');

router.use(auth);

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.get('/signout', (req, res, next) => {
  res.clearCookie('jwt');
  res.status(200).send({ message: 'Вы вышли из аккаунта' });
  next();
});
router.use('*', (req, res, next) => {
  next(new Error('Запрашиваемая страница не найдена'));
});

module.exports = router;
