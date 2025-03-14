import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  const dispatch = useDispatch();
  const [input, setInput] = useState({
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
      setLoading(true);
      const res = await axios.post(`https://insta-clone-sp4v.onrender.com/api/v1/user/login`, input, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
        // navigate("/");
      }
    } catch (error) {
      console.log("Axios Error:", error);
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
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
          {loading ? (
            <Button type="submit">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
            </Button>
          ) : (
            <Button type="submit">
               Log In
            </Button>
          )}
          <h1
            onClick={() => navigate("/register")}
            className="underline-offset-2 cursor-pointer"
          >
            Register Account
          </h1>
        </div>
      </form>
    </div>
  );
};

export default Login;
