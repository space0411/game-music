/**
 * jwToken
 *
 * @description :: JSON Webtoken Service for sails
 * @help        :: See https://github.com/auth0/node-jsonwebtoken & http://sailsjs.org/#!/documentation/concepts/Services
 */

var jwt = require('jsonwebtoken');
var tokenSecret = sails.config.const.jwtSecret;

// Generates a token from supplied payload
module.exports.generate = function (payload, expireTime) {
  const expiresIn = expireTime || 30 * 24 * 60 * 60; // 30 x hours x munite x 60(s) => 30 day
  // console.log(expiresIn)
  return jwt.sign(
    payload,
    tokenSecret, // Token Secret that we sign it with
    {
      expiresIn: expiresIn
    } 
  );
};

// Verifies token on a request
module.exports.verify = function (token, callback) {
  return jwt.verify(
    token, // The token to be verified
    tokenSecret, // Same token we used to sign
    {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    callback //Pass errors or decoded token to callback
  );
};
