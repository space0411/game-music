/**
 * PlatformLink.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    idProduct: {
      type: 'number'
    },
    idFlatform: {
      type: 'number'
    }
  },
  tableName: 'flatform_link'
};

