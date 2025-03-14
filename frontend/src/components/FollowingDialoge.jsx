import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const FollowingDialog = ({ open, setOpen }) => {
  const { user, getUser } = useSelector((store) => store.auth);
  const navigate = useNavigate()

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-center">Following</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 ">
            {getUser?.following?.map((follow) => (
              <div className="flex justify-between">
                <div className="flex items-center gap-4 ">
                  <Avatar
                    onClick={() => {
                      setOpen(false);
                      navigate(`/${follow?._id}/profile`);
                    }}
                    className="w-12 h-12 cursor-pointer"
                  >
                    <AvatarImage
                      className="object-cover rounded-full"
                      src={follow?.profilePicture}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p
                    onClick={() => {
                      setOpen(false);
                      navigate(`/${follow?._id}/profile`);
                    }}
                    className="cursor-pointer text-xl font-bold"
                  >
                    {follow?.username}
                  </p>
                </div>
                {user?._id !== follow?._id ? (
                  user?.following?.includes(follow?._id) ? (
                    <Button>Unfollow</Button>
                  ) : (
                    <Button>Follow</Button>
                  )
                ) : (
                  <Button
                    onClick={() => {
                      setOpen(false);
                      navigate(`/${follow?._id}/profile`);
                    }}
                  >
                    View Profile
                  </Button>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowingDialog;
