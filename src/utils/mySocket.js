const token = "f64366a9-19dc-43fb-b1ed-c33bb11180b6"

class WebSocketClient {
    constructor(params) {
        this.onlineHandlers = [];
        this.offlineHandlers = [];
        this.messageHandlers = [];
        this.connect(params);
    }
  
    // 连接方法
    connect(params) {
        console.log('import.meta.env:',import.meta.env)


        this.messageHandlers = [];
        const wsPath = params.wsFullHost 
        const wsOptions = {
            host: params.wsHost, // 域名，部署到线上直接用当前域名，本地连接可以写死。
            secure: true, // 固定
            transports: ['websocket'], // 固定
            query:  `platform=kf-backend&token=${params.token}`,
            path: "/socket.io/", // 固定
        };

        console.log('wsOptions:',wsOptions);
        console.log('params:',params);
        console.log('wsPath:',wsPath);

        // const wsPath = import.meta.env.DEV ? 'ws://goim.smartkf.top:80/' : 'wss://goim.smartkf.top:443/'
        this.socket = io(wsPath,wsOptions);
        
        // 服务端确认收到消息
        this.socket.on("messageAck",(msg)=>{
            let data = JSON.parse(msg)
            console.log("messageAck-->",data)
        })

        this.socket.on("message",(msg)=>{
            let data = JSON.parse(msg)
            console.log("message-->",data)
            this.messageHandlers.forEach(handler => handler(data));
        })

        this.socket.on('online', (msg) => {
            console.log('online:',msg);
            this.onlineHandlers.forEach(handler => handler(JSON.parse(msg)));
        })

        this.socket.on('offline', (msg) => {
            console.log('online:',msg);
            this.offlineHandlers.forEach(handler => handler(JSON.parse(msg)));
        })


        // this.socket.on('test', function (msg) {
        //     console.log('test:',msg);
        // });

        // 断开ws链接
        this.socket.on('disconnect', (reason) => {
            console.log('Disconnected from the server:', reason);
        });

        // 连上服务器以后，会告诉客户端的sessionId是多少，这个id是 websocket的 连接id
        this.socket.on("sessionId",function(msg){
            console.log("sessionId-->",msg)
        })
      
    }
  
    
  
    // 发送消息
    sendMessage(message) {
        console.log('发送消息:',message);
        this.socket.emit('message', JSON.stringify(message));
    }

    // 接收消息
    onMessage(handler) {
        this.messageHandlers.push(handler);
    }

    onOnline(handler) {
        this.onlineHandlers.push(handler)
    }

    onOffline(handler) {
        this.onlineHandlers.push(handler)
    }
  }

  

export default WebSocketClient;