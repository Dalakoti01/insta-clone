import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const FollowerDialoge = ({ open, setOpen }) => {

  const navigate = useNavigate();
  const { getUser, user } = useSelector((store) => store.auth);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-center">Followers</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 ">
          {getUser?.followers?.map((follower) => (
            <div className="flex justify-between">
              <div className="flex items-center gap-4 ">
                <Avatar onClick={() => {setOpen(false);navigate(`/${follower?._id}/profile`)}} className="w-12 h-12 cursor-pointer">
                  <AvatarImage
                    className="object-cover rounded-full"
                    src={follower?.profilePicture}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p onClick={() => {setOpen(false); navigate(`/${follower?._id}/profile`)} } className="cursor-pointer text-xl font-bold">{follower?.username}</p>
              </div>
              {user?._id !== follower?._id ? (
                user?.following?.includes(follower?._id) ? (
                  <Button>Unfollow</Button>
                ) : (
                  <Button>Follow</Button>
                )
              ) : (
                <Button onClick={() => {setOpen(false); navigate(`/${follower?._id}/profile`)}}>
                  View Profile
                </Button>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowerDialoge;
