const WebSocket = require('ws');//引入模块

const wss = new WebSocket.Server({ port: 12303 });//创建一个WebSocketServer的实例，监听端口8080

let clients=[];

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    /*console.log('received: %s', message);
    ws.send('你好客户端');*/
    clients.push(ws);

    let s=message.toString(); 

    console.log(s);


    wss.clients.forEach(function each(ws) {
       //ws.send(s);
       ws.send(message);
    });
    /*ws.send(s);*/
  });

});