import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/store/postSlice";

const CreatePostDialoge = ({ open, setOpen }) => {
  const backendUri = import.meta.env.VITE_BACKEND_URL;

  const {posts} = useSelector(store => store.post)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState();
  const imageRef = useRef();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const changeEventHandler = (e) => {
    setCaption(e.target.value);
  };

  const changeFileHandler = async (e) => {
    const image = e.target.files?.[0];
    if (image) {
      setImage(image);
      const dataUri =  await readFileAsDataURL(image);
      setImagePreview(dataUri);
    }
  };

  const submitHandler = async (e) => {
    const formData =  new FormData()
    formData.append("description",caption)
    formData.append("profilePhoto",image)
    try {
      setLoading(true)
      const res = await axios.post(`${backendUri}/api/v1/post/createPost`,formData,{
        headers : {
          "Content-Type" : "multipart/form-data"
        },
        withCredentials : true
      })
      if(res?.data?.success){
        dispatch(setPosts([res?.data?.post, ...posts]))
        toast.success(res.data.message)
        setOpen(false)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Create Post
          </DialogTitle>
          <div className="flex flex-col gap-4 justify-center">
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src="" alt="image" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-bold">username</p>
                <span>Bio Here ...</span>
              </div>
            </div>
            <Textarea
              name="caption"
              value={caption}
              onChange={changeEventHandler}
            />
            {imagePreview && (
              <div className="w-full h-60 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Image cannot be proccesseeed"
                  className="object-cover h-full w-full rounded-md"
                />
              </div>
            )}
            <Input
              ref={imageRef}
              type="file"
              onChange={changeFileHandler}
              className="hidden"
            />
            <Button
              onClick={() => imageRef.current.click()}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Select From Computer
            </Button>
            {imagePreview &&
              (loading ? (
                <Button>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" /> Please Wait
                </Button>
              ) : (
                <Button type = "submit" onClick = {submitHandler}>Post</Button>
              ))}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialoge;
