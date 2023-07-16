const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send({ data: movie }))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  console.log(req.params.movieId);
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new Error('Запрашиваемая страница не найдена');
      } else if (req.user._id !== movie.owner.toString()) {
        throw new Error('Недостаточно прав');
      } else {
        return Movie.deleteOne(movie);
      }
    })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};
