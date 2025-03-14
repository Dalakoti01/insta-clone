import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  MoreHorizontal,
  Save,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialouge from "./CommentDialouge";
import { Input } from "./ui/input";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/store/postSlice";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/store/authSlice";

const Post = ({ post }) => {
  const backendUri = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post?.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post?.likes.length);
  const [comment, setComment] = useState(post?.comments);
  const dispatch = useDispatch();
  const deletePost = async () => {
    try {

      const res = await axios.delete(
        `${backendUri}/api/v1/post/deletePost/${post?._id}`,
        { withCredentials: true }
      );
      console.log("step 2");

      if (res.data.success) {
        const filteredPost = posts.filter((p) => p?._id !== post?._id);
        dispatch(setPosts(filteredPost));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const likeOrDislikeHandler = async () => {
    if (!user) {
      toast.error("You must be logged in to like a post.");
      return;
    }

    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.post(
        `${backendUri}/api/v1/post/${action}/${post._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedLike = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLike);
        setLiked(!liked);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user?._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async () => {
    try {
      const res = await axios.post(
        `${backendUri}/api/v1/post/addComment/${post?.author?._id}`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedComment = [...comment, res.data.comment];
        setComment(updatedComment);
        const updatedPostComment = posts.map((p) =>
          p._id === post?._id ? { ...p, comments: updatedComment } : p
        );
        dispatch(setPosts(updatedPostComment));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bookmarkHandler = async () => {
    try {
      console.log("Started bookmark");

      const res = await axios.get(
        `${backendUri}/api/v1/post/bookmarkPost/${post?._id}`,
        { withCredentials: true }
      );

      console.log("API call done");

      if (res.data.success) {
        const updatedUser = {
          ...user,
          bookmark: user?.bookmark.includes(post?._id)
            ? user?.bookmark.filter((id) => id !== post?._id) // Remove bookmark
            : [...user?.bookmark, post?._id], // Add bookmark
        };

        dispatch(setUser(updatedUser)); // Update Redux store
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };

  return (
    <div className="m-3 mt-5 max-w-lg flex justify-center items-center">
      <div className="flex flex-col">
        <div className="flex items-center justify-between  my-2 cursor-pointer">
          <div className="flex gap-4  ">
            <Avatar className="w-12 h-12">
              <AvatarImage
                 onClick={() => navigate(`/${post?.author?._id}/profile`)}
                className="object-cover rounded-full"
                src={post?.author?.profilePicture}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p
              onClick={() => navigate(`/${post?.author?._id}/profile`)}
              className="font-bold text-xl"
            >
              {post?.author?.username}
            </p>
          </div>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <MoreHorizontal size={"40px"} className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center">
                {user?._id === post?.author?._id ? (
                  <Button
                    variant="ghost"
                    className="cursor-pointer text-xl w-fit text-red-600 font-bold"
                  >
                    Owner
                  </Button>
                ) : user?.following?.includes(post?.author?._id) ? (
                  <Button
                    variant="ghost"
                    className="cursor-pointer text-xl w-fit text-red-600 font-bold"
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="cursor-pointer text-xl w-fit text-blue-600 font-bold"
                  >
                    Follow
                  </Button>
                )}

                <Button
                  variant="ghost"
                  className="cursor-pointer text-xl w-fit font-bold"
                  onClick={bookmarkHandler}
                >
                  Add To Favourite
                </Button>
                {user && user?._id === post?.author._id && (
                  <Button
                    onClick={deletePost}
                    variant="ghost"
                    className="cursor-pointer font-bold text-red-600 text-xl w-fit"
                  >
                    Delete
                  </Button>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <img
          className="w-full "
          src={post?.image}
          alt="Image is not able ton be loaded"
        />

        <div className="flex justify-between ">
          <div className="flex gap-3">
            {liked ? (
              <FaHeart
                onClick={likeOrDislikeHandler}
                className="cursor-pointer text-red-600"
                size={"40"}
              />
            ) : (
              <FaRegHeart
                onClick={likeOrDislikeHandler}
                className="cursor-pointer"
                size={"40"}
              />
            )}

            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className="cursor-pointer"
              size={"40"}
            />
            <Send size={"40"} className="cursor-pointer" />
          </div>
          <div>
            {user?.bookmark?.includes(post?._id) ? (
              <BookmarkCheck
                onClick={bookmarkHandler}
                size={"40"}
                className="cursor-pointer"
              />
            ) : (
              <Bookmark
                onClick={bookmarkHandler}
                size={"40"}
                className="cursor-pointer"
              />
            )}
          </div>
        </div>
        <p>{post?.likes?.length}</p>
        <div className="flex gap-2">
          <p className="font-bold">{post?.author?.username}</p>
          <p>{post?.description}</p>
        </div>
        <span
          className="cursor-pointer"
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
        >
          {comment.length > 0 && `View All ${post?.comments?.length} comment`}
        </span>
        <CommentDialouge open={open} setOpen={setOpen} />
        <div className="flex justify-between items-center gap-5">
          <Input
            type="text"
            placeholder="Enter a comment"
            className="outline-none border-none text-sm w-full"
            value={text}
            onChange={changeEventHandler}
          />

          {text && (
            <span onClick={addComment} className="text-blue-600 cursor-pointer">
              Post
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
