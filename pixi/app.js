const WebSocket = require('ws')
const http = require('http')
const express = require('express')
const app = express()

app.use(express.static(__dirname + '/build'))

var server = http.createServer(app)
server.listen(8000)

let id = 0

var wss = new WebSocket.Server({server: server})
wss.on('connection', (ws) => {
  //console.log('started client interval')
  ws.id = id++

  ws.on('message', (data) => {
   // console.log(ws)

    wss.clients.forEach(function each(client) {
      //console.log('wss.clients', client !== ws)
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        const dataToSend = JSON.parse(data)
        dataToSend.id = client.id
        client.send(JSON.stringify(dataToSend))
      }
    })
  })

  ws.on('close', () => {
    console.log('stopping client interval')
  })
})


