'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by jair on 08/10/16.
 */

var User = function () {
  function User(socket, users) {
    _classCallCheck(this, User);

    this.socket = socket;
    this.users = users;
    this.name = '';
  }

  _createClass(User, [{
    key: 'start',
    value: function start() {
      this.socket.on('join', this.onJoin.bind(this));
      this.socket.on('disconnect', this.onLeave.bind(this));
      this.socket.on('sendmessage', this.onSendMessage.bind(this));
    }
  }, {
    key: 'onJoin',
    value: function onJoin(name, callback) {
      console.log("name = " + name);
      this.name = name;

      this.users.set(this.socket.id, this);

      callback({
        id: this.socket.id,
        name: name
      });

      this._sendUsers();
    }
  }, {
    key: 'onLeave',
    value: function onLeave() {
      this.users.delete(this.socket.id);
      this._sendUsers();
    }
  }, {
    key: 'onSendMessage',
    value: function onSendMessage(message, callback) {
      console.log("message = " + message);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.users.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              value = _step$value[1];

          value.sendMessage(message);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      callback(message);
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(message) {
      this.socket.emit('messageReceived', message);
    }
  }, {
    key: 'getId',
    value: function getId() {
      return this.socket.id;
    }
  }, {
    key: 'getName',
    value: function getName() {
      return this.name;
    }
  }, {
    key: 'toJson',
    value: function toJson() {
      return {
        id: this.getId(),
        name: this.getName()
      };
    }
  }, {
    key: '_sendUsers',
    value: function _sendUsers() {
      var data = [];

      this.users.forEach(function (user, id) {
        var name = user.getName();
        data.push(user.toJson());
      });

      this.socket.emit('usersUpdate', data);
      this.socket.broadcast.emit('usersUpdate', data);
    }
  }]);

  return User;
}();

exports.default = User;