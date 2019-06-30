/**
 * Res.js
 */
var moment = require('moment');
module.exports = {
  success: function (body, message) {
    var response = {
      success: true,
      data: body,
      message: message.message
    };
    sails.log(response.message + ' at ' + moment().format('Y-MM-DD h:m:s a'));
    return response;
  },
  error: function (body, message) {
    var response = {
      success: false,
      data: body,
      message: message.message
    }
    sails.log(response.message + ' at ' + moment().format('Y-MM-DD h:m:s a') + '. Error: ' + body);
    return response;
  }

};
