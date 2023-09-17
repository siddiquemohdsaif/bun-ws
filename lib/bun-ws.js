// ws-bun.js

class WebSocketBun {
  constructor(url, protocols = [], options = {}) {
    this.url = url;
    this.protocols = protocols;
    this.options = options;

    this.socket = Bun.serve({
      fetch(req, server) {
        if (server.upgrade(req)) {
          return;
        }
        return new Response("Upgrade failed :(", { status: 500 });
      },
      websocket: {
        message: this._onMessage.bind(this),
        open: this._onOpen.bind(this),
        close: this._onClose.bind(this),
        error: this._onError.bind(this),
        drain: this._onDrain.bind(this),
      },
    });
  }

  _onMessage(ws, message) {
    if (this.onmessage) {
      this.onmessage({ data: message });
    }
  }

  _onOpen(ws) {
    if (this.onopen) {
      this.onopen();
    }
  }

  _onClose(ws, code, message) {
    if (this.onclose) {
      this.onclose({ code, reason: message });
    }
  }

  _onError(ws, error) {
    if (this.onerror) {
      this.onerror({ error });
    }
  }

  _onDrain(ws) {
    // This can be used for backpressure handling, similar to ws.
    // For the simplicity of this example, we're leaving it empty.
  }

  send(data) {
    this.socket.send(data);
  }

  close(code, reason) {
    this.socket.close(code, reason);
  }

  addEventListener(event, callback) {
    switch (event) {
      case 'message':
        this.onmessage = callback;
        break;
      case 'open':
        this.onopen = callback;
        break;
      case 'close':
        this.onclose = callback;
        break;
      case 'error':
        this.onerror = callback;
        break;
      // Add other events as needed.
      default:
        throw new Error('Unsupported event type: ' + event);
    }
  }

  // Add other WebSocket methods as needed.
}

module.exports = WebSocketBun;
