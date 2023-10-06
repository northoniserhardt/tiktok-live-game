const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { WebcastPushConnection } = require('tiktok-live-connector');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Jogo ouvindo o websocket.');

    tiktokLiveConnection = new WebcastPushConnection("@XXXXXXXXXXX");
    tiktokLiveConnection.connect().then(state => {
      console.info(`Escutando dados da live: ${state.roomId}`);
    }).catch(err => {
      console.error('Falha ao conectar', err);
    });

    tiktokLiveConnection.on('chat', data => {
      data.type = 'chat';
      ws.send(JSON.stringify(data));
    });

    tiktokLiveConnection.on('like', data => {
      data.type = 'like';
      ws.send(JSON.stringify(data));
    });

});
console.log('test');
server.listen(3000, () => {
  console.log('Servidor WebSocket iniciado na porta 3000.');
});