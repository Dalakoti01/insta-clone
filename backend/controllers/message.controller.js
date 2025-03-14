import { Conversation } from "../models/conversation.model.js"
import { Message } from "../models/message.model.js"
import { User } from "../models/user.model.js"
import { getRecieverSocketId, io } from "../socket/socket.js"

export const sendMessage = async (req,res) => {

    try {
        const ladka = req.id
        const ladki = req.params.id
        const {message} = req.body
        if(!message){
            return res.status(401).json({
                message : "Message cannot be empty",
                success : false
            })
        }

        let conversation = await Conversation.findOne({
            participants : {$all : [ladka,ladki]}
        })

        if (!conversation){
            conversation = await Conversation.create({
                participants : [ladka,ladki]
            })
        }
        const newMessage = await Message.create({
            message,
            sendersId : ladka,
            recieversId : ladki
        })

        if(newMessage){
            conversation.messages.push(newMessage._id)

        }
        await Promise.all([conversation.save(),newMessage.save()])
        //socket io implementation for real time updates
        const recieverSocketId = getRecieverSocketId(ladki)
        if(recieverSocketId){
            io.to(recieverSocketId).emit('newMessage',newMessage)
            const sender = await User.findById(ladka).select("username profilePicture")
            const messageNotification = {
                type : "message",
                userId : ladka,
                userDetails : sender,
                message : 'Sent You A Message' 
            }
            console.log('Sending notification:', messageNotification);

            io.to(recieverSocketId).emit('notification',messageNotification)
        }

        return res.status(200).json({
            success : true,
            newMessage
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const getMessage = async (req,res) => {

    try {
        const ladka = req.id
        const ladki = req.params.id
        const conversation = await Conversation.findOne({
            participants : {$all : [ladka,ladki]}
        }).populate('messages')
        if(!conversation){
            return res.status(200).json({
                success : true,
                message : []
            })
        }

        return res.status(200).json({
            success : true,
            message : conversation?.messages
        })
    } catch (error) {
        console.log(error);
        
    }
}