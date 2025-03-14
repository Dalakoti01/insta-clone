import { setAllUsers } from "@/store/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllUsers = () => {

  const disptach = useDispatch();
  const { searchUser } = useSelector((store) => store.auth);
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get(
          `https://insta-clone-sp4v.onrender.com/api/v1/user/getUsers?keyword=${searchUser}`,
          { withCredentials: true }
        );
        if(res.data.success){
            disptach(setAllUsers(res.data.users))
        }

      } catch (error) {
        console.log(error);
      }
    };
    fetchAllUsers()
  }, [disptach,searchUser]);
};

export default useGetAllUsers;
