'use strict';

const express = require('express');
const router = express.Router();
var knex = require('../db/knex');
const jwt = require('jsonwebtoken');
const cert = process.env.JWT_KEY;

const {
   camelizeKeys,
   decamelizeKeys
} = require('humps');

let tokenID;

function authorizeUser(req, res, next) {
  jwt.verify(req.cookies.token, cert, (err, payload) => {
   if (err) {
     // Unauthorized
     res.set('Content-type', 'text/plain');
     res.status(401).send('Unauthorized');
   }
   else {
     // Authorized - decription of the claim i.e. user.id
     req.token = payload.userId;
     next();
   }
  })
};

router.get('/favorites', authorizeUser, (req, res, next) => {
    knex('favorites')
      .innerJoin('books', 'books.id', 'favorites.book_id')
      .where('favorites.user_id', req.token)
      .orderBy('books.title', 'ASC')
      .then((favorites_row) => {
        let favs = camelizeKeys(favorites_row);
        res.set('Content-type', 'application/json');
        res.json(favs);

      })
      .catch((err) => {
        next(err);
      });
});

router.get('/favorites/check', authorizeUser, (req, res, next) => {
    let bookId = req.query.bookId;
    knex('favorites')
      .innerJoin('books', 'books.id', 'favorites.book_id')
      .where('favorites.book_id', bookId)
      .orderBy('books.title', 'ASC')
      .then((books) => {
        if (books[0]) {
          // exists
          res.status(200).send(true);
        } else {
          // does not exists
          res.status(200).send(false);
        }
      })
      .catch((err) => {
        next(err);
      })
})

router.post('/favorites', authorizeUser, (req, res, next) => {
      let bookId = req.body.bookId;
      knex('favorites')
        .insert({
          'book_id' : bookId,
          'user_id' : req.token
        })
        .returning('*')
        .then((books) => {
          res.json(camelizeKeys(books[0]));
        })
        .catch((err) => {
            next(err);
        })
})

router.delete('/favorites', authorizeUser, (req, res, next) => {
  const bookId = req.body.bookId;
  let deletedBook;
  knex("favorites")
      .where("book_id", bookId)
      .then((book) => {
          deletedBook = book[0];
          if (!deletedBook) {
            return next()
          }
          return knex("favorites")
        .del()
        .where("book_id", bookId)
      })
      .then(() => {
        delete deletedBook.id;
        res.json(camelizeKeys(deletedBook));
      })
      .catch((err) => {
        next(err);
      });
});

module.exports = router;
