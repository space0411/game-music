/**
 * GameImage.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    url: { type: 'string' },
    idGame: {
      model: 'game',
    }
  },
  tableName: 'game_image',
};

