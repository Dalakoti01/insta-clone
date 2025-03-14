import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauriparser.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Account Already exist with this email ",
        success: "false",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account Created Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "No account Exist with this email",
        success: false,
      });
    }

    const decode = await bcrypt.compare(password, user.password);
    if (!decode) {
      return res.status(401).json({
        message: "Password or email is incorrect",
        success: "false",
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      bookmark : user.bookmark,
      gender : user.gender
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome Back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout =  async (req,res) => {
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message : "Logged Out Successfully",
            success : true
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const getProfile = async (req, res) => {
  try {
      console.log("User ID from URL:", req.params.id); // Debugging

      const userId = req.params.id;
      let user = await User.findById(userId)
          .populate({ path: "posts", options: { sort: { createdAt: -1 } } }) // Populate posts
          .populate("bookmark") // Populate bookmarked posts
          .populate("followers", "username profilePicture") // Populate followers with selected fields
          .populate("following", "username profilePicture"); // Populate following with selected fields

      return res.status(200).json({
          user,
          success: true
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
  }
};


export const editUser = async (req,res) => {
    try {
        const userId = req.id
        const user = await User.findById(userId).select("-password")
        if(!user){
          return res.status(404).json({
            message : "User NOt Found",
            success : false
          })
        }
        const {bio,gender} = req.body
        const profilePicture = req.file;
        let cloudResponse;

        if(profilePicture){
          const fileUri = getDataUri(profilePicture)
          cloudResponse = await cloudinary.uploader.upload(fileUri)
        }
       
        if(bio){
          user.bio = bio
        }
        if(gender){
          user.gender =  gender
        }

        if(profilePicture){
          user.profilePicture = cloudResponse.secure_url
        }

        await user.save()

        return res.status(200).json({
          message : "Profile Updated",
          success : true,
          user
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const suggestedAccount = async (req,res) => {
  try {
    const suggestedUsers = await User.find({_id : {$ne : req.id}}).select("-password")
    if(!suggestedUsers){
      return res.status(400).json({
        message : "Currently there are no suggested Users"
      })
    }
    return res.status(200).json({
      success : true,
      users : suggestedUsers
    })
  } catch (error) {
    console.log(error);
    
  }
}

export const followOrUnfollow = async (req,res) => {
  try {
    const ladka = req.id;
    const ladki =  req.params.id
    if(ladka === ladki){
      return res.status(400).json({
        message : "You cannot follow or unfollow yourself",
        success : false
      })
    }

    const user = await User.findById(ladka)
    const targetUser = await User.findById(ladki)

    if(!user || !targetUser){
      return res.status(400).json({
        message : "User Not Found",
        success : false
      })
    }

    const isFollowing =  user.following.includes(ladki)
    if(isFollowing){
      // Unfollow Algo
      await Promise.all([
        User.updateOne({_id:ladka},{$pull : {following : ladki}}),
        User.updateOne({_id : ladki},{$pull : {followers : ladka}})
      ])
      return res.status(200).json({
        message : "Unfollowed Successfully",
        success : true
      })
    } else{
      // Follow Algo
      await Promise.all([
        User.updateOne({_id:ladka},{$push : {following:ladki}}),
        User.updateOne({_id:ladki},{$push : {followers : ladka}})
      ])

      return res.status(200).json({
        message : "FOLLOWED Successfully",
        success : true
      })
    }


  } catch (error) {
    console.log(error);
    
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    // If no keyword is provided, return an error
    if (!keyword) {
      return res.status(400).json({
        message: "Keyword is required",
        success: false,
      });
    }

    const query = {
      username: { $regex: keyword, $options: "i" }, // Case-insensitive substring search
    };

    const users = await User.find(query).sort({ username: 1 });

    if (users.length === 0) {
      return res.status(404).json({
        message: "No users found matching the keyword",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Users matching your search",
      users,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
