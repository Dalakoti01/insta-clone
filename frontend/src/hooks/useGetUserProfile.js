import { setGetUser } from "@/store/authSlice"
import axios from "axios"
import { useEffect, useCallback } from "react"
import { useDispatch } from "react-redux"

const useGetUserProfile = (userId) => {

    const dispatch = useDispatch();

    const fetchAllUserProfile = useCallback(async () => {
        if (!userId || userId === "null") return;  // ✅ Prevent API call for invalid IDs
        try {
            const res = await axios.get(`https://insta-clone-sp4v.onrender.com/api/v1/user/${userId}/profile`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setGetUser(res.data.user));
            }
        } catch (error) {
            console.log(error);
        }
    }, [userId, dispatch]);

    useEffect(() => {
        fetchAllUserProfile();
    }, [fetchAllUserProfile]);

    return fetchAllUserProfile;
};


export default useGetUserProfile;
