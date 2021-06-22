const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const axios = require('axios')
require('dotenv/config')

// IMPORTING ROUTES
const user = require('./routes/user')
const conversation = require('./routes/conversation')
const message = require('./routes/message')

// CREATING APPLICATION
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origin: '*' }})
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

// ROUTES
app.use(user)
app.use(conversation)
app.use(message)
app.get('/', (req, res) => {
    res.send('Hello!')
})

// CONNECt to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    () => console.log('connected to DB')
)

// LISTENING SERVER
app.listen(8080, () => {
    console.log('Server is running on 8080 port')
})

server.listen(8081, () => {
    console.log('Socket io server is running on 8081 port')
})

// SOCKET IO EVENTS
io.on('connection', (socket) => {

    console.log('User connected:' + socket.id)
    
    const room = socket.handshake.query.room
    socket.join(room)

    socket.on('message', (data) => {
        socket.to(room).emit('new message arrived', data)
    })

    socket.on('delete message', (data) => {
        socket.to(room).emit('deleted message', data)
    })

    socket.on('leave room', () => {
        socket.leave(room)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})