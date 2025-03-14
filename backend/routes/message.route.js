import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { getMessage, sendMessage } from "../controllers/message.controller.js"
const router = express.Router()

router.route("/sendMessage/:id").post(isAuthenticated,sendMessage)
router.route("/getMessage/:id").get(isAuthenticated,getMessage)

export default router