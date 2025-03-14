import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getRecieverSocketId, io } from "../socket/socket.js";
export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const image = req.file;
    const authorId = req.id;

    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({
        message: "Useer NOT fOUND",
        success: false,
      });
    }

    if (!image) {
      return res.status(401).json({
        message: "Image Not selected",
      });
    }

    const optimizeImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizeImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      description,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "Post Created Successfully",
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "profilePicture username" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username , profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const userId = req.id;
    const posts = await Post.find({ author: userId })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const ladka = req.id;
    console.log("User ID from req.id:", ladka);

    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(401).json({
        message: "No post to like ",
        success: false,
      });
    }

    //like logic
    await post.updateOne({ $addToSet: { likes: ladka } });
    await post.save();

    //implement socket io for real time notification
    const user = await User.findById(ladka).select('username profilePicture')

    const postOwnerId = post.author?.toString()

    if(ladka !== postOwnerId){
      //emit a notification 
      const notification = {
        type : 'like',
        userId : ladka,
        userDetails : user,
        postId,
        message : 'Your Post was Liked'
      }
      const postOwnerSocketId = getRecieverSocketId(postOwnerId)
      io.to(postOwnerSocketId).emit('notification',notification)
    }

    return res.status(200).json({
      message: "Post Liked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const ladka = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(401).json({
        message: "No such post is found with such id",
        success: false,
      });
    }
    //dislike logic
    await post.updateOne({ $pull: { likes: ladka } });
    await post.save();

    //socket io

    const user = await User.findById(ladka).select('username profilePicture')

    const postOwnerId = post.author.toString()

    if(user !== postOwnerId){
      //emit A notification

      const notification = {
        type : 'dislike',
        userId : ladka,
        userDetails : user,
        postId : postId,
        message : "Your post was disliked"
      }
      const postOwnerSocketId = getRecieverSocketId(postOwnerId)
      io.to(postOwnerSocketId).emit('notification',notification)
    }

    return res.status(200).json({
      message: "Post Disliked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req,res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const ladka = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        message: "No Such Post is found",
        success: false,
      });
    }

    if (!text) {
      return res.status(400).json({
        message: "Comment cannot be submited empty ",
        success: false,
      });
    }

    const comment = await Comment.create({
      text,
      author: ladka,
      post,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment is added",
      success: true,
      comment,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username profilePicture",
    });

    if (!comments) {
      return res.status(400).json({
        message: "No comment are present for this post",
        success: false,
      });
    }

    return res.status(200).json({
      message: "These are all the comments related to this post",
      comments,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req,res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(401).json({
        message: "No such post found",
        success: false,
      });
    }
    await Post.findByIdAndDelete(postId);

    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    //Delete Associate comment of a deleted post
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "Post has been deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId).populate({
      path: "author",
      select: "username profilePicture",
    });

    if(!post){
      return res.status(200).json({
        message : "No such post exist",
        success : false
      })
    }
    const user = await User.findById(authorId)

    if(user.bookmark.includes(post._id)){
      // Already Bookmarked so unsave
      await user.updateOne({$pull : {bookmark : post._id}})
      await user.save()
      return res.status(200).json({
        message : "Post removed from bookmarked",
        success : true
      })
    } else {
      // Bookmark or save
      await user.updateOne({$addToSet : {bookmark : post._id}})
      await user.save()
      return res.status(200).json({
        message : "Post Bookmarked",
        success : true
      })
    }
  } catch (error) {
    console.log(error);
  }
};
