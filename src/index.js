const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage } = require('./utls/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//let count = 0

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    // socket.emit('countUpdated', count)
    // socket.on('increment', () => {
    //     count++
    //     //socket.emit('countUpdated', count)
    //     io.emit('countUpdated', count)
    // })

    //socket.emit('message', 'Welcome')
    socket.emit('message', generateMessage('Welcome!'))
    socket.broadcast.emit('message', generateMessage('A new user has logged in'))

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'))
    })

    socket.on('sendLocation', (coords) => {
        io.emit('message', `Location: ${coords.latitude}, ${coords.longitude}`)
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    })

    

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})