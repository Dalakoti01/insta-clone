import React, { useState } from "react";
import { SearchCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAllUsers from "@/hooks/useGetAllUsers";
import { setSearchUser } from "@/store/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Search = () => {

  useGetAllUsers();
  const disptach = useDispatch();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const { allUsers } = useSelector((store) => store.auth);

  const submitHandler = async () => {
    disptach(setSearchUser(query));
  };

  return (
    <div className="w-full ml-[250px] ">
      <div className="bg-black text-white w-1/3 h-screen flex flex-col gap-7">
        <h1 className="ml-4 mt-6 font-bold text-white text-3xl ">Search</h1>
        <div className="flex justify-between gap-4">
          <input
            className="bg-gray-700 w-3/4 ml-4 h-[40px] px-4 rounded-lg "
            type="text"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={submitHandler}>
            <SearchCheck className="text-white mr-8 " />
          </button>
        </div>
        <div className="flex flex-col gap-5">
          {allUsers?.map((searchedUser) => (<div className="flex gap-5 ml-4">
            <Avatar
            onClick={() => {
              navigate(`/${searchedUser?._id}/profile`);
            }}
            className="w-12 h-12 cursor-pointer"
          >
            <AvatarImage
              className="object-cover rounded-full"
              src={searchedUser?.profilePicture}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 onClick={() => {
              navigate(`/${searchedUser?._id}/profile`);
            }} className="font-bold cursor-pointer text-xl">{searchedUser?.username}</h1>
          </div>))}
          
        </div>
      </div>
    </div>
  );
};

export default Search;
