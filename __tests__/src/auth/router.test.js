'use strict';

process.env.SECRET = 'test';

const jwt = require('jsonwebtoken');

const Roles = require('../../../src/auth/roles-model.js');
const server = require('../../../src/app.js').server;
const supergoose = require('../../supergoose.js');

const mockRequest = supergoose.server(server);

let users = {
  superuser: {username: 'superuser', password: 'password', role: 'superuser'},
  admin: {username: 'admin', password: 'password', role: 'admin'},
  editor: {username: 'editor', password: 'password', role: 'editor'},
  user: {username: 'user', password: 'password', role: 'user'},
};

beforeAll(async (done) => {
  await supergoose.startDB();
  done();
});


afterAll(supergoose.stopDB);

describe('Auth Router', () => {
  
  Object.keys(users).forEach( userType => {
    
    describe(`${userType} users`, () => {
      
      let encodedToken;
      let id;
      
      it('can create one', () => {
        return mockRequest.post('/signup')
          .send(users[userType])
          .then(results => {
            var token = jwt.verify(results.text, process.env.SECRET);
            id = token.id;
            encodedToken = results.text;
            expect(token.id).toBeDefined();
            expect(token.capabilities).toBeDefined();
          });
      });

      it('can signin with basic', () => {
        return mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            var token = jwt.verify(results.text, process.env.SECRET);
            expect(token.id).toEqual(id);
            expect(token.capabilities).toBeDefined();
          });
      });

      it('can signin with bearer', () => {
        return mockRequest.post('/signin')
          .set('Authorization', `Bearer ${encodedToken}`)
          .then(results => {
            var token = jwt.verify(results.text, process.env.SECRET);
            expect(token.id).toEqual(id);
            expect(token.capabilities).toBeDefined();
          });
      });

    });
    
  });
  
});

describe('Roles Router', () => {
  
  Object.keys(users).forEach( userType => {

    describe(`${userType} users`, () => {
      
      let encodedToken;
      let id;

      it('roles route adds all roles to the database', () => {
        return mockRequest.get('/create-roles')
          .then(result => {
            expect(result.status).toBe(200);
          });
      });

      it('can signin with basic', () => {
        return mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            encodedToken = results.text;
            var token = jwt.verify(results.text, process.env.SECRET);
            id = token.id;
          });
      });

      it('anyone can access the public route', () => {
        return mockRequest.get('/public-stuff')
          .then(result => {
            expect(result.status).toBe(200);            
          });
      });

      it('verified users can access the hidden route', () => {
        return mockRequest.get('/hidden-stuff')
          .set('Authorization', `Bearer ${encodedToken}`)
          .then(result => {
            expect(result.status).toBe(200);            
          });
      });

      it('users with read capabilities can access the read route', () => {
        return mockRequest.get('/something-to-read')
          .set('Authorization', `Bearer ${encodedToken}`)
          .then(result => {
            expect(result.status).toBe(200);            
          });
      });

      it('users with create capabilities can access the create route', () => {
        return mockRequest.post('/create-a-thing')
          .set('Authorization', `Bearer ${encodedToken}`)
          .then(result => {
            if(users[userType].role === 'user') {
              expect(result.status).toBe(500);
            } else {
              expect(result.status).toBe(200);            
            }
          });
      });

      it('users with update capabilities can access the update route', () => {
        return mockRequest.put('/update')
          .set('Authorization', `Bearer ${encodedToken}`)
          .then(result => {
            if(users[userType].role === 'user') {
              expect(result.status).toBe(500);
            } else {
              expect(result.status).toBe(200);            
            }
          });
      });

      it('users with update capabilities can access the patch route', () => {
        return mockRequest.patch('/jp')
          .set('Authorization', `Bearer ${encodedToken}`)
          .then(result => {
            if(users[userType].role === 'user') {
              expect(result.status).toBe(500);
            } else {
              expect(result.status).toBe(200);            
            }
          });
      });

      it('users with delete capabilities can access the delete route', () => {
        return mockRequest.delete('/bye-bye')
          .set('Authorization', `Bearer ${encodedToken}`)
          .then(result => {
            if(users[userType].role === 'admin' || users[userType].role === 'superuser') {
              expect(result.status).toBe(200);            
            } else {
              expect(result.status).toBe(500);
            }
          });
      });

      it('only superusers can access the everything route', () => {
        return mockRequest.get('/everything')
          .set('Authorization', `Bearer ${encodedToken}`)
          .then(result => {
            if(users[userType].role === 'superuser') {
              expect(result.status).toBe(200);            
            } else {
              expect(result.status).toBe(500);
            }
          });
      });
    });

  });
});