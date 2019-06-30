/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');

module.exports = {

  attributes: {

    // id: {
    //   type: 'number',
    //   autoIncrement: true,
    //   unique: true,
    //   primaryKey: true
    // },
    email: {
      type: 'string',
      unique: true
    },
    role: {
      type: 'string',
      isIn: ['admin', 'user'],
      defaultsTo: 'user'
    },
    password: {
      type: 'string',
      columnName: 'hashedPassword',
      protect: true,
    },
    address: { type: 'string' },
    name: { type: 'string' },
    phone: { type: 'number' },
    activated: { type: 'boolean', defaultsTo: false }
  },
  tableName: 'user',
  customToJSON: function () {
    return _.omit(this, ['password']);
  },
  beforeCreate: function (values, next) {

    console.log('values.password beforeCreate', values.password);
    // encrypt password
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { return next(true); }
      bcrypt.hash(values.password, salt, (err, hash) => {
        if (err) { return next(err); }
        values.hashedPassword = hash;
        delete values.password;
        next();
      });
    });
  },
  beforeUpdate: function (values, next) {

    console.log('values.password beforeUpdate', values.password);
    if (!values.password) { return next(); }
    // encrypt password
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { return next(true); }
      bcrypt.hash(values.password, salt, (err, hash) => {
        if (err) { return next(err); }
        values.hashedPassword = hash;
        delete values.password;
        next();
      });
    });
  },
};

