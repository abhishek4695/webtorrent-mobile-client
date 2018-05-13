
var exec = require('cordova/exec');

var PLUGIN_NAME = 'MOForceAppClose';

var MOForceAppClose = {
  forceAppClose: function(phrase, cb) {
    exec(cb, null, PLUGIN_NAME, 'forceAppClose', [phrase]);
  }
};

module.exports = MOForceAppClose;
