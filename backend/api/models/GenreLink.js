/**
 * GenreLink.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    idProduct: {
      model: 'product',
    },
    idGenre: {
      model: 'genre'
    }
  },
  tableName: 'genre_link'
};

