'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    title: Joi.string()
      .label('Book title')
      .required(),

    author: Joi.string()
      .label('Book Author')
      .required(),

    genre: Joi.string()
      .label('Book genre')
      .required(),

    description: Joi.string()
      .label('Book Description')
      .required(),

    cover_url: Joi.string()
      .label('Cover URL')
      .required()
  }
}

module.exports.patch = {
  params: {
    id: Joi.number().integer().greater(0);
  },

  body: {
    title: Joi.string()
      .label('Book title')
      .required(),

    author: Joi.string()
      .label('Book Author')
      .required(),

    genre: Joi.string()
      .label('Book genre')
      .required(),

    description: Joi.string()
      .label('Book Description')
      .required(),

    cover_url: Joi.string()
      .label('Cover URL')
      .required()
  }
  }
}
