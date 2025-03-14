import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/store/authSlice";
import { MessageCircleCode } from "lucide-react";
import MessageInside from "./MessageInside";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { setMessages } from "@/store/chatSlice";
import { clearMessageNotification } from "@/store/rtnSlice";

const Message = () => {
  const backendUri = import.meta.env.VITE_BACKEND_URL;

  const [textMessage, setTextMessage] = useState("");
  const { unreadMessage } = useSelector((store) => store.chat);

  const { user, suggestedUser, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async () => {
    console.log("start");

    try {
      const res = await axios.post(
        `${backendUri}/api/v1/message/sendMessage/${selectedUser?._id}`,
        { message: textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      toast.error(error.response.message.data);
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="w-full flex ml-[250px]">
      {" "}
      {/* Push content to the right */}
      {/* Left Section */}
      <div className="w-[250px] mt-7">
        <h1 className="font-bold text-2xl mb-4 py-4 px-3  border-b-2 border-b-gray-300">
          {user?.username}
        </h1>
        {suggestedUser?.map((user) => {
          const isOnline = onlineUsers.includes(user?._id);
          return (
            <div className="flex gap-4 my-2 mx-2" key={user?._id}>
              <Avatar className="w-12 h-12">
                <AvatarImage
                  className="object-cover rounded-full"
                  src={user?.profilePicture}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p
                  onClick={() => {
                    dispatch(setSelectedUser(user));
                    dispatch(clearMessageNotification(user._id));
                  }}
                  className="font-bold cursor-pointer"
                >
                  {user?.username}
                  {unreadMessage[user._id] > 0 && (
                    <span className=" rounded-full bg-red-600 text-white text-xs px-2 py-1">
                      {unreadMessage[user._id]}
                    </span> 
                    
                  )}
                  {isOnline ? (
                  <div className="text-xs text-green-600">Online</div>
                ) : (
                  <div className="text-xs text-red-600">Offline</div>
                )}
                </p>
                

                
              </div>
          );
        })}
      </div>
      {/* Right Section */}
      <div className="flex-1 border-l-2 h-screen bg-slate-300 border-l-gray-300">
        {selectedUser ? (
          <div className="h-full  flex flex-col  gap-5 mt-5">
            <div className="flex gap-3 mx-2">
              <Avatar className="w-14 h-14 ">
                <AvatarImage
                  className="object-cover cursor-pointer rounded-full"
                  src={selectedUser?.profilePicture}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="font-semibold mt-3">{selectedUser?.username}</p>
            </div>
            <MessageInside selectedUser={selectedUser} />
            <div className="flex justify-between gap-5 w-full mb-7 ml-1 ">
              <Input
                className="focus-visible:ring-transparent"
                placeholder="Messages ...."
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                type="text"
              />
              <Button onClick={sendMessageHandler}>Send</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-screen justify-center items-center">
            <MessageCircleCode className="w-32 h-32 my-4 cursor-pointer" />
            <p className="font-bold">Your Messages</p>
            <p className="font-bold">Send a message to start a chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
