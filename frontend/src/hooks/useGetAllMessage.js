import { setMessages } from "@/store/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {

  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);
  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const res = await axios.get(
          `https://insta-clone-sp4v.onrender.com/api/v1/message/getMessage/${selectedUser?._id}`,
          { withCredentials: true }
        );

        if(res.data.success){
            dispatch(setMessages(res.data.message))
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllMessage()
  }, [selectedUser]);
};

export default useGetAllMessage