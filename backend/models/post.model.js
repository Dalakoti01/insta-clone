import mongoose,{Schema} from "mongoose";

const postSchema = new Schema(
    {

        description : {
            type : String,
            
        },
        image : {
            type : String,
            required : true
        },
        likes : [{
            type : Schema.Types.ObjectId,
            ref : "User" 
        }],
        author : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },
        comments : [{
            type : Schema.Types.ObjectId,
            ref : "Comment"
        }]
    },{timestamps : true}
)

export const Post = mongoose.model("Post",postSchema)