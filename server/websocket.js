const ws = require('ws')

const PORT = 5000

const wss = new ws.Server({
    port: PORT
}, () => console.log(`Server started on ${PORT}`))

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        message = JSON.parse(message)
        switch (message.event) {
            case 'connection':
                broadcastMessage(message)
                break;
            case 'message':
                broadcastMessage(message)
                break;
        }
    })
})

const broadcastMessage = (message) => {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}
