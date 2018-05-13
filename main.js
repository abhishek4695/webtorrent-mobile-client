var parseTorrent = require('parse-torrent')
exports.parseInfo = function parseInfo (str) {
  console.log(parseTorrent(str));
  return parseTorrent(new Buffer(str, 'hex'))
}