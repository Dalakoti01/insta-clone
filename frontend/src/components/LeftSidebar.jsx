import {
  ArrowRightFromLine,
  CirclePlus,
  Heart,
  Home,
  icons,
  MessageCircle,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { clearLikeNotifications } from "@/store/rtnSlice";
import { clearUnreadMessage } from "@/store/chatSlice";

const LeftSidebar = ({setOpen}) => {
  
  const {likeNotification} = useSelector(store => store.realTimeNotification)
  const [isPopoverOpen,setIsPopoverOpen] = useState(false)
  const {unreadMessage } = useSelector(store => store.chat)
  const {user} = useSelector(store => store.auth)
  const backendUri = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handlePopoverOpen = (open) => {
    setIsPopoverOpen(open)
    setTimeout(() => {
      dispatch(clearLikeNotifications()); // Clears notifications AFTER popover opens
    }, 10000);
  }
  const sidebarItem = [
    { icons: <Home size={"40"} />, text: "Home" },
    { icons: <Search size={"40"} />, text: "Search" },
    { icons: <TrendingUp size={"40"} />, text: "Explore" },
    { icons: <MessageCircle size={"40"} />, text: "Message" },
    { icons: <Heart size={"40"} />, text: "Heart" },
    { icons: <CirclePlus size={"40"} />, text: "Create" },
    {
      icons: (
        <Avatar className="w-10 h-10">
          <AvatarImage
            className="object-cover rounded-full"
            src={user?.profilePicture}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icons: <ArrowRightFromLine size={"40"} />, text: "Logout" },
  ];

  const logOutHandler = async () => {    
    try {      
      const res = await axios.get(`${backendUri}/api/v1/user/logout`, {
        withCredentials: true,
      });
      
      if(res.data.success){
        dispatch(setUser(null))
        toast.success(res.data.message)
        navigate("/login")
      }
    } catch (error) {
      console.log();
    }
  };

  

  const sideBarHandler = (textType) => {
    console.log("sidebarhandler clicked");
    
    if (textType === "Logout"){
      console.log("logout clicked");
      
      logOutHandler()
    } else if(textType === "Create"){
      setOpen(true)
    } else if(textType === "Message"){
      dispatch(clearUnreadMessage());
      navigate("/message")
    } else if(textType === "Home"){
      navigate("/")
    } else if(textType === "Profile"){
      navigate(`${user._id}/profile`)
    } else if(textType === "Search"){
      navigate("/search")
    }
  }
  return (
    <div className="px-5 overflow-y-auto ml-auto fixed top-0  z-10 left-0  w-[250px] h-screen  border-r border-gray-300 ">
      {sidebarItem.map((item, index) => (
        <div onClick={() => sideBarHandler(item.text)} className="flex gap-5 pt-4 pb-2 hover:bg-slate-200 text-2xl  font-bold px-3 my-7 cursor-pointer" key={index}>
          {item.icons} <span className="pb-4 ">{item.text}</span>
          {item.text === "Message" && 
  Object.values(unreadMessage).reduce((acc, count) => acc + count, 0) > 0 && (
    <span className="absolute right-4 top-15 rounded-full bg-red-600 text-white text-xs px-2 py-1">
      {Object.values(unreadMessage).reduce((acc, count) => acc + count, 0)}
    </span>
)}
          {item.text === "Heart" && likeNotification.length > 0 && (
              <Popover  onOpenChange={handlePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 ">{likeNotification?.length}</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div>
                      {likeNotification.length === 0 ? <p>No New Notification</p> : likeNotification.map(notification => (<div className="flex items-center gap-2 my-2" key={notification.userId}>
                        <Avatar>
                          <AvatarImage src={notification?.userDetails?.profilePicture}/>
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <p className="text-sm"> <span className="font-bold">{notification.userDetails?.username}</span> liked your post</p>
                      </div>))}
                    </div>
                </PopoverContent>
              </Popover>
            
          )}
        </div>
      ))}
    </div>
  );
};

export default LeftSidebar;
