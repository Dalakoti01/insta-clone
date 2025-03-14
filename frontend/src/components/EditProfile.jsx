import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const EditProfile = () => {
  const [loading,setLoading] = useState(false)
  const backendUri = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate()
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [input, setInput] = useState({
    bio: user?.bio,
    username: user?.username,
    profilePicture: user?.profilePicture,
    gender : user.gender? user.gender : "Male" 
  });
  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePicture: file });
    }
  };

  const selectChangeHandler = (e) => {
    setInput({ ...input, gender: e });
  };

  const submitHandler = async () => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("bio", input.bio);
      formData.append("gender", input.gender);
      if (input.profilePicture) {
        formData.append("profilePhoto", input.profilePicture);
      }
      const res = await axios.post(
        `${backendUri}/api/v1/user/updateProfile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUser = {
          ...user,
          bio: res?.data?.user?.bio,
          gender: res?.data?.user?.gender,
          profilePicture: res?.data?.user?.profilePicture,
        };
        dispatch(setUser(updatedUser));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.message.data);
      console.log(error);
    } finally {
      setLoading(false)
    }
  };
  return (
    <div className="flex ">
      <div className=" w-full flex flex-col gap-4  ">
        <h1 className="font-bold text-xl ">Edit Profile</h1>
        <div className="bg-slate-300  rounded-lg flex justify-between gap-28 p-7">
          <div className="flex gap-4">
            <Avatar className="w-24 h-24 ">
              <AvatarImage
                className="object-cover cursor-pointer rounded-full"
                src={user?.profilePicture}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-3 font-bold">
              <p>{user?.username}</p>
              <p>{user?.bio}</p>
              <p>{user?.gender}</p>
            </div>
          </div>
          <div>
            <input
              onChange={changeFileHandler}
              ref={imageRef}
              type="file"
              className="hidden"
            />
            <Button
              onClick={() => imageRef?.current?.click()}
              className="bg-blue-500 hover:bg-blue-700"
            >
              Change Photo{" "}
            </Button>
          </div>
        </div>
        <h1 className="font-bold text-xl">Bio</h1>
        <Textarea
          value={input.bio}
          onChange={(e) => setInput({ ...input, bio: e.target.value })}
          className="focus-visible:ring-transparent"
        />
        <h1 className="font-bold text-xl">Gender</h1>
        <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex justify-end">
          {loading? <Button
            onClick={submitHandler}
            className="bg-blue-500 hover:bg-blue-700 justify-end w-[100px] items-end"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            Please Wait
          </Button> :<Button
            onClick={submitHandler}
            className="bg-blue-500 hover:bg-blue-700 justify-end w-[80px] items-end"
          >
            Submit
          </Button>}
          
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
