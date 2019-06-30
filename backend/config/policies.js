/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  UserController: {
    'logout': 'isAuthorized',
    'activate': 'isAuthorized',
    'delete': 'isAdmin',
    'read': 'isAdmin',
    'newotp': 'isAuthorized'
  },
  ProductController: {
    'create': 'isAdmin',
    'update': 'isAdmin',
    'delete': 'isAdmin',
    'image': 'isAdmin'
  },
  FlatformController: {
    'create': 'isAdmin',
    'update': 'isAdmin',
    'delete': 'isAdmin'
  },
  GenreController: {
    'create': 'isAdmin',
    'update': 'isAdmin',
    'delete': 'isAdmin'
  },
  MusicController: {
    'create': 'isAdmin',
    'update': 'isAdmin',
    'delete': 'isAdmin',
    'updateMusicUrl': 'isAdmin'
  },
};
