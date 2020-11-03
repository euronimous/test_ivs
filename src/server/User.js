/**
 * Created by jair on 08/10/16.
 */

export default class User {
  constructor(socket, users) {
    this.socket = socket;
    this.users = users;
    this.name = '';
  }

  start() {
    this.socket.on('join', this.onJoin.bind(this));
    this.socket.on('disconnect', this.onLeave.bind(this));
    this.socket.on('sendmessage', this.onSendMessage.bind(this));
  }

  onJoin(name, callback) {
    console.log("name = " + name);
    this.name = name;

    this.users.set(this.socket.id, this);

    callback({
      id: this.socket.id,
      name: name
    });

    this._sendUsers();
  }

  onLeave() {
    this.users.delete(this.socket.id);
    this._sendUsers();
  }

  onSendMessage(message, callback) {
        console.log("message = " + message);
    for (const [key, value] of this.users.entries()) {
         value.sendMessage(message);
    }
    callback(message);
  }

  sendMessage(message) {
    this.socket.emit('messageReceived', message);
  }

  getId() {
    return this.socket.id;
  }

  getName() {
    return this.name;
  }

  toJson() {
    return {
      id: this.getId(),
      name: this.getName()
    };
  }

  _sendUsers() {
    const data = [];

    this.users.forEach((user, id) => {
      const name = user.getName();
      data.push(user.toJson());
    });

    this.socket.emit('usersUpdate', data);
    this.socket.broadcast.emit('usersUpdate', data);
  }
}
