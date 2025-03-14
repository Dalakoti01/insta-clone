import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : "auth",
    initialState : {
        user : null,
        suggestedUser : null,
        getUser : null,
        selectedUser : null,
        searchUser : "",
        allUsers : null

    },
    reducers : {
        setUser : (state,action) => {
            state.user = action.payload
        },
        setSuggestedUser : (state,action) => {
            state.suggestedUser = action.payload
        },
        setGetUser : (state,action) => {
            state.getUser = action.payload
        },

        setSelectedUser : (state,action) => {
            state.selectedUser = action.payload
        },
        setSearchUser : (state,action) => {
            state.searchUser = action.payload
        },
        setAllUsers : (state,action) => {
            state.allUsers = action.payload
        }
    }
})

export const {setUser,setSuggestedUser,setGetUser,setSelectedUser,setSearchUser,setAllUsers} = authSlice.actions
export default authSlice.reducer