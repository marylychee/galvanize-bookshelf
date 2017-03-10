'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

var knex = require('../db/knex');

// YOUR CODE HERE
router.get('/english', function(req, res) {
  res.send('Hello world');
});

router.get('/spanish', function(req, res) {
  res.send('Hola mundo');
});





module.exports = router;
