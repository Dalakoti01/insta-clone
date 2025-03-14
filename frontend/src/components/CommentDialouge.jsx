import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/store/postSlice";
import { useNavigate } from "react-router-dom";

const CommentDialouge = ({ open, setOpen }) => {



  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selectedPost,posts } = useSelector((store) => store.post);
  const [text,setText] = useState("")
  const [comment,setComment] = useState([])
  const changeEventHandler = (e) => {
    const inputText = e.target.value
    if(inputText.trim()){
      setText(inputText)
    } else{
      setText("")
    }
  }

  useEffect(() => {
    if(selectedPost){
      setComment(selectedPost.comments)
    }
  },[selectedPost])
  
  const addComment = async () => {
    console.log("started");
    
    try {
      const res = await axios.post(
        `https://insta-clone-sp4v.onrender.com/api/v1/post/addComment/${selectedPost?._id}`,
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
          p._id === selectedPost?._id ? { ...p, comments: updatedComment } : p
        );
        dispatch(setPosts(updatedPostComment));
        dispatch(setSelectedPost({ ...selectedPost, comments: updatedComment }));

        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className = "w-[80vw] h-[70vh]  max-w-none" onInteractOutside={() => setOpen(false)}>
        <div className="w-full flex gap-5">
          <img
            className="w-[500px] h-[500px] rounded-md object-fill  "
            src={selectedPost?.image}
            alt="cannot be rendered"
          />
          <div className="flex flex-col gap-4 w-1/2">
            <div className="flex justify-between gap-14">
              <div className="flex gap-4 ">
                <Avatar onClick={() => {navigate(`${selectedPost?.author?._id}/profile`)}} className="w-12  h-12">
                  <AvatarImage
                    className="object-cover cursor-pointer  rounded-full"
                    src={selectedPost?.author?.profilePicture}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span onClick={() => {navigate(`${selectedPost?.author?._id}/profile`)}} className="cursor-pointer text-xl font-bold " >{selectedPost?.author?.username}</span>
              </div>
              <Dialog>
              <DialogTrigger asChild>
                <MoreHorizontal className="cursor-pointer" size={"40px"} />
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  className="cursor-pointer w-fit text-red-600 font-bold"
                >
                  Unfollow
                </Button>
                <Button
                  variant="ghost"
                  className="cursor-pointer w-fit font-bold"
                >
                  Add To Favourite
                </Button>
                <Button
                  variant="ghost"
                  className="cursor-pointer w-fit text-red-600 font-bold"
                >
                  Cancel
                </Button>
              </DialogContent>
            </Dialog>
            </div>
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment?.map(comment => <Comment key={comment?._id} comment={comment}/>)}
            </div>
            <div className=" flex items-center gap-2">
              <input
              className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
              value={text}
              onChange={changeEventHandler} 
              placeholder="Enter A Comment"
              type="text" />

              <Button onClick = {addComment} disabled = {!text.trim()}>Post</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialouge;
