'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    email: Joi.string();
      .label('Email')
      .required()
      .email()
      .trim(),

    password: Joi.string();
      .label('Password')
      .requried()
      .trim()
      .min(8)
  }
}
