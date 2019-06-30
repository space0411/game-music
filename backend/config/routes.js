/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

  /* User API endpoints */
  'POST /api/v1/user/signup': 'UserController.signup',
  'POST /api/v1/user/login': 'UserController.login',
  'GET /api/v1/user/logout': 'UserController.logout',
  'POST /api/v1/user/activate': 'UserController.activate',
  'POST /api/v1/user/forgotpassword': 'UserController.forgot',
  'GET /api/v1/user/password': 'UserController.password',
  'DELETE /api/v1/user/delete': 'UserController.delete',
  'POST /api/v1/user/read': 'UserController.read',
  'POST /api/v1/user/newotp': 'UserController.newotp',
  /* Product API endpoints */
  'POST /api/v1/product/read': 'ProductController.read',
  'POST /api/v1/product/create': 'ProductController.create',
  'POST /api/v1/product/image': 'ProductController.image',
  'POST /api/v1/product/update': 'ProductController.update',
  'DELETE /api/v1/product/delete': 'ProductController.delete',
  /* Flatform API endpoints */
  'POST /api/v1/flatform/read': 'FlatformController.read',
  'POST /api/v1/flatform/create': 'FlatformController.create',
  'POST /api/v1/flatform/update': 'FlatformController.update',
  'DELETE /api/v1/flatform/delete': 'FlatformController.delete',
  /* Genre API endpoints */
  'POST /api/v1/genre/read': 'GenreController.read',
  'POST /api/v1/genre/create': 'GenreController.create',
  'POST /api/v1/genre/update': 'GenreController.update',
  'DELETE /api/v1/genre/delete': 'GenreController.delete',
  /* Music API endpoints */
  'POST /api/v1/music/stream': 'MusicController.stream',
  'POST /api/v1/music/read': 'MusicController.read',
  'POST /api/v1/music/create': 'MusicController.create',
  'POST /api/v1/music/updatemusicurl': 'MusicController.updateMusicUrl',
  'POST /api/v1/music/update': 'MusicController.update',
  'DELETE /api/v1/music/delete': 'MusicController.delete',
};
