/**
 * Game.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    idDeveloper: {
      type: 'number'
    },
    name: {
      type: 'string'
    },
    releaseDate: {
      type: 'number'
    }
  },

};

