import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { singleUpload } from "../middlewares/multer.js"
import { addComment, bookmarkPost, createPost, deletePost, dislikePost, getAllPost, getCommentOfPost, getUserPost, likePost } from "../controllers/post.controller.js"

const router = express.Router()

router.route("/createPost").post(isAuthenticated,singleUpload,createPost)
router.route("/getAllPost").get(isAuthenticated,getAllPost)
router.route("/getUserPost/all").get(isAuthenticated,getUserPost)
router.route("/like/:id").post(isAuthenticated,likePost)
router.route("/dislike/:id").post(isAuthenticated,dislikePost)
router.route("/addComment/:id").post(isAuthenticated,addComment)
router.route("/getCommentOfPost/:id").get(isAuthenticated,getCommentOfPost)
router.route("/deletePost/:id").delete(isAuthenticated,deletePost)
router.route("/bookmarkPost/:id").get(isAuthenticated,bookmarkPost)

export default router