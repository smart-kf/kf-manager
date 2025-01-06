class WebSocketClient {
    constructor(url, options = {}) {
      this.url = url;
      this.reconnectInterval = options.reconnectInterval || 5000; // 自动重连间隔时间
      this.heartbeatInterval = options.heartbeatInterval || 30000; // 心跳检测间隔时间
      this.heartbeatMessage = options.heartbeatMessage || { type: 'heartbeat' };
      this.socket = null;
      this.isManualClose = false;
      this.heartbeatTimer = null;
      this.reconnectTimer = null;
      this.messageHandlers = [];
      
      this.connect();
    }
  
    // 连接方法
    connect() {
      this.socket = new WebSocket(this.url);
  
      this.socket.onopen = () => {
        console.log('WebSocket connection opened.');
        this.startHeartbeat();
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
        }
      };
      
      // 接收到消息
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('websocket接收到消息：',data);
          this.messageHandlers.forEach(handler => handler(data));
        } catch (error) {
          
        }
        
      };
  
      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed.', event);
        this.stopHeartbeat();
        // if (!this.isManualClose) {
        //   this.reconnect();
        // }
      };
  
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.socket.close();
      };
    }
  
    // 重连方法
    reconnect() {
      console.log('Attempting to reconnect...');
      this.reconnectTimer = setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    }
  
    // 启动心跳检测
    startHeartbeat() {
      this.heartbeatTimer = setInterval(() => {
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(this.heartbeatMessage));
        }
      }, this.heartbeatInterval);
    }
  
    // 停止心跳检测
    stopHeartbeat() {
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
    }
  
    // 发送消息
    sendMessage(message) {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      } else {
        console.error('WebSocket is not open. Unable to send message.');
      }
    }
  
    // 接收消息
    onMessage(handler) {
      this.messageHandlers.push(handler);
    }
  
    // 关闭连接
    close() {
      this.isManualClose = true;
      this.stopHeartbeat();
      if (this.socket) {
        this.socket.close();
      }
    }
  }
  
  export default WebSocketClient;