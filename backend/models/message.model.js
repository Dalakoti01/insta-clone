import mongoose,{Schema} from "mongoose";

const messageSchema = new Schema (
    {
        message : {
            type : String,
            required : true
        },
        sendersId : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },
        recieversId : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    },{timestamps : true}
)

export const Message = mongoose.model("Message",messageSchema)