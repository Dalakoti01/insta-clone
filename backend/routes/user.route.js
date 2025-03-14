import express from "express"
import { editUser, followOrUnfollow, getAllUsers, getProfile, login, logout, register, suggestedAccount } from "../controllers/user.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { singleUpload } from "../middlewares/multer.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/:id/profile").get(isAuthenticated,getProfile)
router.route("/updateProfile").post(isAuthenticated,singleUpload,editUser)
router.route("/suggestedAccount").get(isAuthenticated,suggestedAccount)
router.route("/followOrUnfollow/:id").get(isAuthenticated,followOrUnfollow)
router.route("/getUsers").get(isAuthenticated,getAllUsers)

export default router