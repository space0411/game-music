/**
 * Music.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: { type: 'string' },
    type: { type: 'string' },
    url: { type: 'string' },
    idProduct: {
      model: 'product'
    }
  },
  tableName: 'music'
};

