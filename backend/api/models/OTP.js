/**
 * OTP.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var moment = require('moment');
module.exports = {

    attributes: {

        otp: {
            type: 'string',
            columnType: 'text'
        },
        expireTime: { type: 'number' },
        owner: {
            model: 'user'
        }
    },
    beforeCreate: function (values, next) {
        values.otp = Math.floor(100000 + Math.random() * 900000);
        values.expireTime = moment().add(5, 'm').unix();
        return next();
    },
};
