import { setSuggestedUser } from "@/store/authSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetAllSuggestedUser = () => {

    const dispatch = useDispatch()
    useEffect(() => {
        const fetchAllSuggestedUser = async () => {
            try {
                const res = await axios.get(`https://insta-clone-sp4v.onrender.com/api/v1/user/suggestedAccount`,{withCredentials:true})
                if(res.data.success){
                    dispatch(setSuggestedUser(res.data.users))
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchAllSuggestedUser()
    } ,[])
}

export default useGetAllSuggestedUser