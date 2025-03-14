import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import dbConnect from "./utils/db.js"
import userRouter from "../backend/routes/user.route.js"
import postRouter from "../backend/routes/post.router.js"
import messageRouter from "../backend/routes/message.route.js"
import {app,server} from "./socket/socket.js"
import path from "path"

dotenv.config({path: "./.env"})

const PORT = process.env.PORT || 3000
const __dirname = path.resolve()

const corstOption = {
    origin : 'http://localhost:5173',
    credentials : true
}

app.use(cors(corstOption))

app.use(express.json())
app.use(express.urlencoded({extended :true}))
app.use(cookieParser())

app.use("/api/v1/user",userRouter)
app.use("/api/v1/post",postRouter)
app.use("/api/v1/message",messageRouter)

app.use(express.static(path.join(__dirname,"frontend/dist")))
app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
})

server.listen(PORT , () => {
    dbConnect()
    console.log(`Server is running at PORT ${PORT}`);
    
})