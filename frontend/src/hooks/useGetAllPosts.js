import { setPosts } from "@/store/postSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetAllPost = () => {
    const backendUri = import.meta.env.VITE_BACKEND_URL;

    const dispatch = useDispatch()
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(`${backendUri}/api/v1/post/getAllPost`,{withCredentials:true})
                if(res.data.success){
                    dispatch(setPosts(res.data.posts))
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchAllPost()
    } ,[])
}

export default useGetAllPost