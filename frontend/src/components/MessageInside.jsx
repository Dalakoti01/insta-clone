import useGetAllMessage from "@/hooks/useGetAllMessage";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import useRTM from "@/hooks/useRTM";
import { clearUnreadMessage } from "@/store/chatSlice";

const MessageInside = ({ selectedUser }) => {
  useRTM(selectedUser)
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedUser) {
      dispatch(clearUnreadMessage(selectedUser._id)); // Clear unread messages when opening chat
    }
  }, [selectedUser, dispatch]);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex flex-col w-full items-center justify-center gap-5">
        <Avatar className="w-10 h-10">
          <AvatarImage
            className="object-cover cursor-pointer rounded-full"
            src={selectedUser?.profilePicture}
          />
          <AvatarFallback className="w-13 h-13 cursor-pointer">
            CN
          </AvatarFallback>
        </Avatar>
        <p className="font-bold cursor-pointer">{selectedUser?.username}</p>
        <Button variant="secondary" className="bg-slate-200 hover:bg-slate-400">
          View Profile
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg) => (
            <div
              className={`flex ${
                msg?.sendersId === user?._id ? "justify-end" : "justify-start"
              }`}
              key={msg._id}
            >
              <div className={`p-2 rounded-lg break-words ${msg?.sendersId === user?._id ? 'bg-blue-500 text-white ' : 'bg-slate-200 text-black'}`}>
                {msg?.message}
              </div>
            </div>
          ))}
      </div> 
    </div>
  );
};

export default MessageInside;
