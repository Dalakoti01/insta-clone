import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { setSelectedUser, setSuggestedUser, setUser } from "@/store/authSlice";
import axios from "axios";
import { toast } from "sonner";
import useGetUserProfile from "@/hooks/useGetUserProfile";

const RightSidebar = () => {

  const { user, suggestedUser, selectedUser } = useSelector(
    (store) => store.auth
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchUserProfile = useGetUserProfile(selectedUser?._id || null);


  const followOrUnfollow = async () => {
    try {
      const res = await axios.get(
        `https://insta-clone-sp4v.onrender.com/api/v1/user/followOrUnfollow/${selectedUser?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedUser = {
          ...user,
          following: user?.following?.includes(selectedUser?._id)
            ? user?.following?.filter((id) => id !== selectedUser?._id)
            : [...user?.following, selectedUser?._id],
        };
        dispatch(setUser(updatedUser))
        const updatedSuggestedUsers = suggestedUser.map((suggested) =>
          suggested._id === selectedUser?._id
            ? {
                ...suggested,
                followers: suggested.followers.includes(user?._id)
                  ? suggested.followers.filter((id) => id !== user?._id)
                  : [...suggested.followers, user?._id],
              }
            : suggested
        );
        dispatch(setSuggestedUser(updatedSuggestedUsers))
        toast.success(res.data.message);

        fetchUserProfile()
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full mt-5 ml-10">
      <div className="flex flex-col gap-8 ">
        <div className="flex gap-3">
          <Avatar  className="w-12  h-12">
            <AvatarImage
              className="object-cover cursor-pointer  rounded-full"
              src={user?.profilePicture}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col ">
            <p
              onClick={() => navigate(`${user?._id}/profile`)}
              className="font-bold cursor-pointer"
            >
              {user?.username}
            </p>
            <span className="text-slate-600">{user?.bio}</span>
          </div>
        </div>
        <div className="flex  justify-between">
          <p className="text-slate-600">Suggested For You</p>
          <p>See all</p>
        </div>
        <div className="flex flex-col gap-5 items-center ">
          {suggestedUser?.map((clickedUser) => (
            <div
              key={clickedUser?.id}
              className="w-full flex   justify-between items-center"
            >
              <div className="flex gap-3">
                <Avatar className="w-12 h-12 cursor-pointer">
                  <AvatarImage
                    className="object-cover cursor-pointer rounded-full"
                    src={clickedUser?.profilePicture}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p
                  onClick={() => navigate(`${clickedUser?._id}/profile`)}
                  className="font-bold mt-3 cursor-pointer"
                >
                  {clickedUser?.username}
                </p>
              </div>

              {clickedUser?.followers.includes(user?._id) ? (
                <p
                  onClick={() => {
                    dispatch(setSelectedUser(clickedUser));
                    followOrUnfollow();
                  }}
                  className="text-blue-500 cursor-pointer"
                >
                  Unfollow
                </p>
              ) : (
                <p
                  onClick={() => {
                    dispatch(setSelectedUser(clickedUser));
                    followOrUnfollow();
                  }}
                  className="text-blue-500 cursor-pointer"
                >
                  Follow
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
