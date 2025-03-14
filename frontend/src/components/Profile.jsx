import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import {
  Bookmark,
  BookUser,
  Heart,
  MessageCircle,
  StickyNote,
  TvMinimalPlay,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { setGetUser, setUser } from "@/store/authSlice";
import { Dialog } from "./ui/dialog";
import FollowingDialog from "./FollowingDialoge";
import FollowerDialoge from "./FollowerDialoge";

const Profile = () => {
  const backendUri = import.meta.env.VITE_BACKEND_URL;

  const [openFollower ,setOpenFollower] = useState(false)
  const [open,setOpen] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [text, setText] = useState("Post");
  const params = useParams();
  const userId = params.id;
  console.log(userId);

  const fetchUserProfile = useGetUserProfile(userId);

  const { user, getUser } = useSelector((store) => store.auth);
  const isLoggedInUser = user?._id === getUser?._id;
  useEffect(() => {
    dispatch(setGetUser(null))
    fetchUserProfile()
  } , [userId,dispatch])
  const followOrUnfollowHandler = async () => {
    try {
      const res = await axios.get(
        `${backendUri}/api/v1/user/followOrUnfollow/${getUser?._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedUser = {
          ...user,
          following: user?.following?.includes(getUser?._id)
            ? user?.following?.filter((id) => id !== getUser?._id)
            : [...user?.following, getUser?._id],
        };
        dispatch(setUser(updatedUser))
        toast.success(res.data.message);
        fetchUserProfile()
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  const clickHandeling = (item) => {
    setText(item);
  };
  const displayedPost =
    text === "Post"
      ? getUser?.posts
      : text === "Saved"
      ? getUser?.bookmark
      : text === "Reels"
      ? getUser?.reels
      : text === "Tags"
      ? getUser?.tags
      : [];
  return (
    <div className="flex w-full min-w-0">
      {/* Left Sidebar (Already Rendered in Another Component) */}

      {/* Main Content Wrapper */}
      <div className="w-[calc(100%-250px)] ml-auto">
        <div className="flex justify-center gap-20">
          <Avatar className="w-40 h-40 mt-12">
            <AvatarImage
              className="object-cover cursor-pointer rounded-full"
              src={getUser?.profilePicture}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-10 justify-center items-center h-full">
            <div className="flex gap-5 mt-9">
              <p className="mt-2 font-bold">{getUser?.username}</p>
              {isLoggedInUser ? (
                <div className="flex gap-3">
                  <Link to="/edit/profile">
                    <Button variant="secondary">Edit Profile</Button>
                  </Link>
                  <Button variant="secondary">View Archive</Button>
                  <Button variant="secondary">Ad Tool</Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  {user?.following?.includes(getUser?._id) ? <Button
                    onClick={followOrUnfollowHandler}
                    className=""
                    variant="secondary"
                  >
                    Unfollow
                  </Button> : <Button
                    onClick={followOrUnfollowHandler}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    variant="secondary"
                  >
                    Follow
                  </Button> }
                  
                  <Button variant="secondary">Message</Button>
                </div>
              )}
            </div>
            <div className="flex justify-between gap-10 w-full text-lg">
              <p className="flex cursor-pointer items-center gap-5">
                <span className="font-bold text-xl">
                  {getUser?.posts.length}
                </span>
                Posts
              </p>
              <p onClick={() => setOpen(true)} className="flex items-center cursor-pointer gap-5">
                <span className="font-bold text-xl">
                  {getUser?.followers.length}
                </span>
                Followers
                
              </p>
              <FollowerDialoge open={open} setOpen ={setOpen}/>
              <p onClick={() => setOpenFollower(true)} className="flex items-center gap-5 cursor-pointer">
                <span className="font-bold text-xl">
                  {getUser?.following.length}
                </span>
                Following
              </p>
              <FollowingDialog open={openFollower} setOpen={setOpenFollower}/>
              
            </div>
            <div className="flex flex-col gap-1 w-full">
              <p className="font-bold">{getUser?.username}</p>
              <p className="max-w-26">{getUser?.bio}</p>
            </div>
          </div>
        </div>

        {/* Horizontal Line - Now Covers Full Width */}
        <div className="w-full mt-20">
          <div className="w-full border-t-2 border-gray-300"></div>
        </div>
        <div className="w-full flex justify-center gap-14 items-center mt-10">
          <p
            onClick={() => clickHandeling("Post")}
            className={`text-xl  flex gap-3  cursor-pointer ${
              text === "Post" ? "font-bold" : ""
            }`}
          >
            <StickyNote /> Post
          </p>
          <p
            onClick={() => clickHandeling("Reels")}
            className={`text-xl  flex gap-3  cursor-pointer ${
              text === "Reels" ? "font-bold" : ""
            }`}
          >
            <TvMinimalPlay /> Reels
          </p>
          <p
            onClick={() => clickHandeling("Saved")}
            className={`text-xl  flex gap-3  cursor-pointer ${
              text === "Saved" ? "font-bold" : ""
            }`}
          >
            <Bookmark /> Saved
          </p>
          <p
            onClick={() => clickHandeling("Tags")}
            className={`text-xl  flex gap-3  cursor-pointer ${
              text === "Tags" ? "font-bold" : ""
            }`}
          >
            <BookUser /> Tags
          </p>
        </div>
        <div className="grid grid-cols-3 gap-1 bg-black">
          {displayedPost?.length > 0 ? (
            displayedPost.map((post) => (
              <div
                className="relative cursor-pointer bg-black group w-full h-96"
                key={post?._id}
              >
                <img
                  className="w-full h-full object-cover"
                  src={post?.image}
                  alt="Post"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
                  <div className="flex items-center justify-center text-white space-x-4">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span>{post?.likes?.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span>{post?.comments?.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-white">No Posts to Show</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
