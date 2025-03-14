import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name : "chat",
    initialState : {
        onlineUsers : [],
        messages : [],
        unreadMessage : {},
    },
    reducers : {
        setOnlineUsers : (state,action) => {
            state.onlineUsers = action.payload
        },
        setMessages : (state,action) => {
            state.messages = action.payload
        },
        increamentUnreadMessage : (state,action) => {
            const senderId = action.payload
            if(state.unreadMessage[senderId]){
                state.unreadMessage[senderId] += 1
            } else {
                state.unreadMessage[senderId] = 1
            }
           
        },
        clearUnreadMessage : (state,action) => {
            const senderId = action.payload
            state.unreadMessage[senderId] = 0 ;
        }
    }
})

export const {setOnlineUsers,setMessages,increamentUnreadMessage,clearUnreadMessage} = chatSlice.actions
export default chatSlice.reducer