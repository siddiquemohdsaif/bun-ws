//ws-bun.js
const { EventEmitter } = require('events');

/**
 * Represents a WebSocket server.
 * @extends EventEmitter
 */
class WebSocketServer extends EventEmitter {
  /**
   * Constructs a new WebSocketServer.
   * @param {Object} options - Configuration options for the WebSocketServer.
   */
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

  /**
   * Closes the WebSocketServer.
   * @param {Function} [callback] - Callback function to be called after the server is closed.
   */
  close(callback) {
    this.server.stop();
    if (callback) callback();
  }
}

/**
 * Represents a WebSocket connection.
 * @extends EventEmitter
 */
class WebSocket extends EventEmitter {
  /**
   * Constructs a new WebSocket connection.
   * @param {Object} wsInstance - The underlying WebSocket instance.
   */
  constructor(wsInstance) {
    super();
    this.ws = wsInstance;
    
    this.ws.subscribe('message', (message) => this.emit('message', message));
    this.ws.subscribe('open', () => this.emit('open'));
    this.ws.subscribe('close', (code, message) => this.emit('close', code, message));
    this.ws.subscribe('error', (error) => this.emit('error', error));
    this.ws.subscribe('drain', () => this.emit('drain'));
  }

  /**
   * Sends data through the WebSocket.
   * @param {*} data - The data to send.
   * @param {Object} [options={}] - Options for sending the data.
   * @param {boolean} [options.compress=false] - Whether to compress the data.
   * @param {Function} [callback] - Callback function to be called after data is sent.
   */
  send(data, options = {}, callback) {
    const compress = options.compress || false;
    this.ws.send(data, compress);
    if (callback) callback();
  }

  /**
   * Closes the WebSocket connection.
   * @param {number} code - Status code to indicate why the connection is being closed.
   * @param {string} reason - A human-readable string explaining why the connection is being closed.
   */
  close(code, reason) {
    this.ws.close(code, reason);
  }
}

module.exports = {
  WebSocketServer
};
