/**
 * JwtToken.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    token: {
      type: 'string',
      columnType: 'text'
    },
    issuedAt: { type: 'number' },
    expireTime: { type: 'number' },
    isActive: { type: 'boolean' },

    // Add a reference to User
    owner: {
      model: 'user'
    }
  },

};

