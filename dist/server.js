'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _User = require('./User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by jair on 08/10/16.
 */

var app = (0, _express2.default)();

app.use(_express2.default.static(__dirname + '/public'));

var server = (0, _http.Server)(app);

var sio = (0, _socket2.default)(server);

var allUsers = new Map();

sio.on('connection', function (socket) {
  var user = new _User2.default(socket, allUsers);
  user.start();
});

var port = 3000;

server.listen(port);

console.log('Server listening on port ' + port);