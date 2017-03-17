'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../db/knex');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cert = process.env.JWT_KEY;

const {
    camelizeKeys,
    decamelizeKeys
} = require('humps');



router.get('/token', (req, res, next) => {
    jwt.verify(req.cookies.token, cert, (err, payload) => {
        if (err) {
            //unauthorized
            res.set('Content-type', 'application/json');
            res.status(200).send('false');
        } else {
            res.set('Content-type', 'application/json');
            res.status(200).send('true');
        }
    });
})

router.post('/token', (req, res, next) => {
    const { email, password } = req.body;
    let user;
    knex('users')
        .where('email', email)
        .then((users) => {
            user = users[0];
            return bcrypt.compare(req.body.password, user.hashed_password)
        })
        .then(() => {
            // res is true and our passwords are matched
            const claim = {
                userId: user.id
            };

            const token = jwt.sign(claim, cert, {
                expiresIn: '7 days'
            });

            res.cookie('token', token, {
                path: '/',
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                secure: router.get('env') === 'production'
            });

            delete user.hashed_password;

            return res.status(200).send(camelizeKeys(user));
        })
        .catch((err) => {
            res.set('Content-Type', 'text/plain')
            return res.status(400).send('Bad email or password');
            return next()
        })
});

router.delete('/token', (req, res, next) => {
    res.clearCookie('token', {
        path: '/token'
    })
    res.set('Content-type', 'application/json');
    res.status(200).send('true');
})

module.exports = router;
