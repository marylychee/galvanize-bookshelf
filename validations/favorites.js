'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    book_id: Joi.number()
      .integer()
      .label('Book id')
      .required()
      .trim(),
    user_id: Joi.number()
      .integer()
      .label('User id')
      .required()
      .trim()
  }
};
