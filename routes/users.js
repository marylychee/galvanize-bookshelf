'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const ev = require('express-validation');
const validations = require('../validations/users')

const {
   camelizeKeys,
   decamelizeKeys
} = require('humps');

router.post('/users', ev(validations.post), (req, res, next) => {

  // Run error checking

  // Validations passed -- Submit into databse and
  // redirect

  // Validation failed -- Re-render as data is
  // invalid

  bcrypt.hash(req.body.password, 12)
    .then((hashed_password) => {
      return knex('users')
        .insert({
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email,
          hashed_password: hashed_password
        }, '*');
    })
    .then((users) => {
      const user = users[0];
      delete user.hashed_password;
      res.send(camelizeKeys(user));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
