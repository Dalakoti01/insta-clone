import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo Db Conneected Successfully");
        
    } catch (error) {
        console.log(error);
        
    }
}
    
export default dbConnect