import {Server} from "socket.io"
import express from "express"
import http from "http"

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors : {
        origin : process.env.URL,
        methods : ['Get','Post']
    }
})

const userSocketMap = {}
export const getRecieverSocketId = (recieverId) => userSocketMap[recieverId]
io.on('connection',(socket) =>{
    const userId = socket.handshake.query.userId
    if(userId){
        userSocketMap[userId] = socket.id
        console.log(`User Connected : UserId : ${userId},Socket Id : ${socket.id}`);
        
    }
    io.emit('getOnlineUsers' ,Object.keys(userSocketMap))

    socket.on('disconnect', () => {
        if(userId){
            console.log(`User Connected : UserId : ${userId} , SocketId : ${socket.id}`);
            delete userSocketMap[userId]
            
        }
        io.emit('getOnlineUsers',Object.keys(userSocketMap))
    })
})

export {app,server,io}