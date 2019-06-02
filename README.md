![CF](http://i.imgur.com/7v5ASc8.png) LAB  
=================================================  
  
## Lab 14  
  
### Author: Morgana Spake  
  
### Links and Resources  
* [submission PR](https://github.com/401-advanced-javascript-mspake/lab-14/pull/1)  
* [travis](https://www.travis-ci.com/401-advanced-javascript-mspake/lab-14)  
  
### Modules  
#### `app.js, google.js, middleware.js, router.js, roles-router.js, users-model.js, roles-model.js, 404.js, error.js`
##### Exported Values and Methods

###### `app -> express server`  
###### `google -> google auth2.0 authentication function`  
###### `book -> express Router instance`  
###### `middleware -> authentication middleware`  
###### `router -> express Router instance`  
###### `roles-router -> express Router instance`  
###### `users-model -> mongoose model`  
###### `roles-model -> mongoose model`  
###### `404 -> route not found middleware`  
###### `error -> error handler middleware`  
  
### Setup  
#### `.env` requirements  
* `PORT` - Port number  
* `MONGODB_URI` - URL to the running mongo instance/db  
* `SECRET` - Secret used to encode tokens and keys  
* `GOOGLE_CLIENT_ID`
* `GOOGLE_CLIENT_SECRET`
* `EXPIRATION` - If you want tokens to expire set the time here (i.e: 15m or 1hr, etc...)  
* `SINGLE_USE` - If you want tokens to be single use, set this to true.  
    
#### Running the app  
* `npm start`  
Endpoints:  
* `/signup` - basic auth only  
* `/signin` - basic auth only  
* `/oauth` - oauth google login  
* `/key` - Using your signin token, you can generate a key that never expries and allows you access to the protected route.  
* `/public-stuff` - Anyone can access this route  
* `/hidden-stuff` - Authorized users can access this route  
* `/something-to-read` - Authorized users with read capabilities can access this route  
* `/create-a-thing` - Authorized user with create capabilities can accesss this route  
* `/update` - Authorized users with update capabilities can access this route  
* `/jp` - Authorized users with update capabilities can access this route  
* `/bye-bye` - Authorized users with delete capabilities can access this route  
* `/everything` - Authorized users with super user capabilities can access this route  
  
#### Tests  
* How do you run tests?
* What assertions were made?
* What assertions need to be / should be made?
  
#### UML  
![uml](https://github.com/401-advanced-javascript-mspake/lab-14/tree/role-based-authentication/assets/uml.jpg)