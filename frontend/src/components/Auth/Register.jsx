import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

const Register = () => {
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const {user} = useSelector(store => store.auth)

  useEffect(() => {
      if(user){
        navigate("/")
      }
    },[])
  const backendUri = import.meta.env.VITE_BACKEND_URL;

  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const addEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("Form Data:", input); // Debugging

    try {
      setLoading(true)
      const res = await axios.post(
        `${backendUri}/api/v1/user/register`,
        input, 
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }, 
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log("Axios Error:", error);
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally{
      setLoading(false)
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-300 flex flex-col justify-center items-center">
      <form onSubmit={submitHandler}>
        <div className="p-10 font-bold border-s-4 rounded-md bg-white flex flex-col gap-7">
          <div>
            <h1 className="text-center">LOGO</h1>
            <p>Sign Up to have a real social media experience</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Username</Label>
            <Input
              name="username"
              type="text"
              value={input.username}
              onChange={addEventHandler}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={input.email}
              onChange={addEventHandler}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              value={input.password}
              onChange={addEventHandler}
            />
          </div>
          {loading?<Button type="submit"> <Loader2 className="mr-2 animate-spin h-4 w-4"/> Please Wait</Button>:<Button type="submit">Sign Up</Button>}
          
        </div>
      </form>
    </div>
  );
};

export default Register;
