'use strict';

const express = require('express');
const router = express.Router();
var knex = require('../db/knex');

const {
   camelizeKeys,
   decamelizeKeys
} = require('humps');

router.post('/users', (req, res, next) => {
  knex('users')
    .then((users) => {
        res.send(users);
    })
});

module.exports = router;
