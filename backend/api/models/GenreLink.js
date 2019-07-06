/**
 * GenreLink.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    idGame: {
      model: 'game',
    },
    idGenre: {
      model: 'genre'
    }
  },
  tableName: 'genre_link'
};

