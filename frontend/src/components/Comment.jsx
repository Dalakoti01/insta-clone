import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Comment = ({ comment }) => {
    const {selectedPost} = useSelector(store => store.post)
    const navigate = useNavigate()
  return (
    <div className="my-4">
      <div className="flex gap-3 items-center">
        <Avatar onClick = {() => navigate(`${comment?.author?._id}/profile`)}>
          <AvatarImage
            className="object-cover cursor-pointer  rounded-full"
            src={comment?.author?.profilePicture}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span onClick = {() => navigate(`${comment?.author?._id}/profile`)} className="cursor-pointer font-bold">{comment?.author?.username}</span>
        <span>{comment?.text}</span>
      </div>
    </div>
  );
};

export default Comment;
