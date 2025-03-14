import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name : "realTimeNotification",
    initialState : {
        likeNotification : [],
        messageNotification : []
    },
    reducers : {
        setLikeNotification : (state,action) => {
            if(action.payload.type === "like"){
                state.likeNotification.push(action.payload)
            } else if(action.payload.type === "dislike"){
                state.likeNotification = state.likeNotification.filter((item) => item.userId !== action.payload.userId )
            }
        },
        clearLikeNotifications : (state) => {
            state.likeNotification = []
        },
        setMessageNotification : (state,action) => {
            if (!state.messageNotification) {
                state.messageNotification = []; 
              }
            state.messageNotification.push(action.payload)
        },
        clearMessageNotification : (state) => {
            state.messageNotification = []
        }
    }
})

export const {setLikeNotification,clearLikeNotifications,setMessageNotification,clearMessageNotification} = rtnSlice.actions
export default rtnSlice.reducer