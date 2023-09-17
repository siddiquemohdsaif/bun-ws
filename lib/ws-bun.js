//ws-bun.js
const { EventEmitter } = require('events');

class WebSocketServer extends EventEmitter {
  constructor(options) {
    super();
    this.server = Bun.serve({
      ...options,
      fetch(req, server) {
        if (server.upgrade(req)) {
          return;
        }
        return new Response("Upgrade failed :(", { status: 500 });
      },
      websocket: {
        message: (ws, message) => this.emit('message', ws, message),
        open: (ws) => this.emit('connection', new WebSocket(ws)),
        close: (ws, code, message) => this.emit('close', ws, code, message),
        error: (ws, error) => this.emit('error', ws, error),
        drain: (ws) => this.emit('drain', ws)
      }
    });
  }

  close(callback) {
    this.server.stop();
    if (callback) callback();
  }
}

class WebSocket extends EventEmitter {
  constructor(wsInstance) {
    super();
    this.ws = wsInstance;
    
    this.ws.subscribe('message', (message) => this.emit('message', message));
    this.ws.subscribe('open', () => this.emit('open'));
    this.ws.subscribe('close', (code, message) => this.emit('close', code, message));
    this.ws.subscribe('error', (error) => this.emit('error', error));
    this.ws.subscribe('drain', () => this.emit('drain'));
  }

  send(data, options = {}, callback) {
    const compress = options.compress || false;
    this.ws.send(data, compress);
    if (callback) callback();
  }

  close(code, reason) {
    this.ws.close(code, reason);
  }
}

module.exports = {
  WebSocketServer
};
