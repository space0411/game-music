/**
 * Product.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: { type: 'string' },
    developer: { type: 'string' },
    releaseDate: { type: 'number' },
    numberOfFile: { type: 'number', defaultsTo: 0 },
    createdBy: { model: 'user' },
    view: { type: 'number', defaultsTo: 0 },
    shortDetail: { type: 'string' },
    fullDetail: { type: 'string' },
  },
  tableName: 'product',
};

