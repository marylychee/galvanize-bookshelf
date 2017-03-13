'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../db/knex');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const {
    camelizeKeys,
    decamelizeKeys
} = require('humps');



router.get('/token', (req, res, next) => {
    jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
        if (err) {
            //unauthorized
            res.set('Content-type', 'application/json');
            res.status(200).send(false);
        } else {
            res.set('Content-type', 'application/json');
            res.status(200).send('true');
        }
    });
})

router.post('/token', (req, res, next) => {
    knex('users')
        .where('email', req.body.email)
        .then((res_row) => {
            bcrypt.compare(req.body.password, res_row[0].hashed_password)
              .then(function(res) {
                // res can be true or false
                return res;
              })
              .then(function(true_res) {
                // res is true and our passwords are matched
                const claim = {
                    userId: res_row[0].id
                };
                const token = jwt.sign(claim, process.env.JWT_KEY, {
                    expiresIn: '7 days'
                });

                res.cookie('token', token, {
                    path: '/',
                    httpOnly: true,
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days)
                    secure: router.get('env') === 'production' // Set from the NODE_ENV
                });

                delete res_row[0].hashed_password;

                res.send(camelizeKeys(res_row[0]));

              })
        });
});

router.delete('/token', (req, res, next) => {
  res.clearCookie('token', { path: '/token' });
  res.send(true);
})

module.exports = router;
