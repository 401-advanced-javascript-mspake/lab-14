'use strict';

const express = require('express');
const rolesRouter = express.Router();

const User = require('./users-model.js');
const auth = require('./middleware.js');
const oauth = require('./oauth/google.js');

rolesRouter.get('/public-stuff', (request, response, next) => {
  response.status(200).send('Thank you for visiting our server');
});
rolesRouter.get('/hidden-stuff', auth(), (request, response, next) => {
  response.status(200).send(`Welcome ${request.user.username}. Thank you for being a member!`);
});
rolesRouter.get('/something-to-read', auth('read'), (request, response, next) => {
  response.status(200).send(`Congrats, you have read access!`);
});
rolesRouter.post('/create-a-thing', auth('create'), (request, response, next) => {
  response.status(200).send(`Congrats, you have create access!`);
});
rolesRouter.put('/update', auth('update'), (request, response, next) => {
  response.status(200).send(`Congrats, you have update access!`);
});
rolesRouter.patch('/jp', auth('update'), (request, response, next) => {
  response.status(200).send(`Congrats, you have update access!`);
});
rolesRouter.delete('/bye-bye', auth('delete'), (request, response, next) => {
  response.status(200).send(`Congrats, you have delete access!`);
});
rolesRouter.get('/everything', auth('superuser'), (request, response, next) => {
  response.status(200).send(`Congrats, you have superuser access!`);
});

module.exports = rolesRouter;