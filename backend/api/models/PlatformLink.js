/**
 * PlatformLink.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    idGame: {
      type: 'number',
      model: 'game',
    },
    idFlatform: {
      type: 'number'
    }
  },
  tableName: 'flatform_link'
};

