import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true
        },
        email :{
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true,
        },
        gender : {
            type : String,
            enum : ["Male","Female","Others"]
        },
        bio : {
            type : String,
            
        },
        profilePicture : {
            type : String,
            default : ''
        },
        posts: [{
            type : Schema.Types.ObjectId,
            ref : "Post"
        }],
        bookmark : [{
            type : Schema.Types.ObjectId,
            ref : "Post"
        }],
        saved : {
            type : Schema.Types.ObjectId,
            ref : "Post"
        },
        followers : [{
            type : Schema.Types.ObjectId,
            ref : "User"
        },],
        following : [{
            type : Schema.Types.ObjectId,
            ref : "User"
        }]
    },{timestamps : true}
)

export const User = mongoose.model("User",userSchema)