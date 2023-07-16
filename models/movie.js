const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^(http|https):\/\/(www\.)?[a-zA-Z\d-._~:/?#[\]@!$&'()*+,;=]+#?$/.test(v),
      message: 'Введите ссылку на изображение',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^(http|https):\/\/(www\.)?[a-zA-Z\d-._~:/?#[\]@!$&'()*+,;=]+#?$/.test(v),
      message: 'Введите ссылку на видео',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^(http|https):\/\/(www\.)?[a-zA-Z\d-._~:/?#[\]@!$&'()*+,;=]+#?$/.test(v),
      message: 'Введите ссылку на изображение',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
