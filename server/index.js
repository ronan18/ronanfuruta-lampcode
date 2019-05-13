const express = require('express');
const WebSocket = require('ws')
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
const wss = new WebSocket.Server({ port: 3030 })
const app = express();
let lampState = {
  on: false,
  color: '#fff'
}
wss.on('connection', ws => {
  ws.send(JSON.stringify({type: 'update', state: lampState}))
  ws.on('message', message => {
    console.log(JSON.parse(message))
    const data = JSON.parse(message);
    if (data.state) {
      lampState =  data.state
      myEmitter.emit('lampUpdate');
    }
  })
  myEmitter.on('lampUpdate', () => {
    console.log('lampUpdate');
    ws.send(JSON.stringify({type: 'update', state: lampState}))
  });

})
app.get('/v2/lampState', function (req, res) {
  console.log('Got request from lamp')
  res.status(200)
  res.send(lampState)
  res.end()
});
app.listen(3000, function () {
  console.log('app listening on port 3000.');
});