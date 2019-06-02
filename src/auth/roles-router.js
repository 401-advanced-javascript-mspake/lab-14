'use strict';

const express = require('express');
const rolesRouter = express.Router();

const User = require('./users-model.js');
const auth = require('./middleware.js');
const oauth = require('./oauth/google.js');
const Role = require('./roles-model.js');


rolesRouter.get('/create-roles', (request, response, next) => {
  const user = new Role({role: 'user', capabilities: ['read']});
  const editor = new Role({role: 'editor', capabilities: ['read', 'create', 'update']});
  const admin = new Role({role: 'admin', capabilities: ['read', 'create', 'update', 'delete']});
  const superuser = new Role({role: 'superuser', capabilities: ['read', 'create', 'update', 'delete', 'superuser']});

  Promise.all([
    user.save().catch(next),
    editor.save().catch(next),
    admin.save().catch(next),
    superuser.save().catch(next),
  ])
    .then( results => {
      response.status(200).send('Creating Roles: user, editor, admin, and superuser');
    })
    .catch(next);
});

rolesRouter.get('/delete-roles', (request, response, next) => {
  Role.deleteMany({capabilities: 'read'}, function (err) {}).then( result => {
    response.send(result);
  });
});

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