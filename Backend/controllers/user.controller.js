import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { inngest } from "../inngest/client.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// I am actually not using those wrapper function asyncHandler as i had used it in one of my backend project so here instead of it i will use trycatch everywhere
export const signUp = async (req, res) => {
  const { email, password, skills = [] } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const isUserExists = await User.findOne({ email });
    if (isUserExists) throw new Error("User already Exists");

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      skills,
    })
    
    const user = await User.findById(createdUser._id).select("-password")

    // Fire inngest events like sending mail to the user for signing up successfully

    await inngest.send({
      // name of the event
      name: "user/signup",
      data: {
          
        userId: user._id
      },
    });

    const token = jwt.sign(
      { _id: user._id, role: user.role , email : user.email},
      process.env.JWT_SECRET
    );

    const options = {
      httpOnly : true,
      secure : false
    }

    res.status(200).cookie("accessToken", token, options).json(new ApiResponse(200,{user, token},"Signup successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500,{},`Signup Faileds: ${error.message}`))
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(new ApiResponse(404,{}, "User not found"));
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword)
      return res.status(401).json(new ApiResponse(401,{}, "Invalid Credentials"));

    const token = jwt.sign(
      { _id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET
    );
    // Here, for this application I am verifying the user only with the single token which is the access token
    // so to make the cookie unmodifiable from the front-end we use few options
    const options = {
      httpOnly: true,
      secure: false, // true in production
    };
    res.status(200).cookie("accessToken", token, options).json(new ApiResponse(200, {user,token}, "Login Successful"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500,{}`Login Failed: ${error.message}`));
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(200).json(new ApiResponse(200,{}, "No token found"));
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false, // match what you used while setting it
    });

    res.status(200).json(new ApiResponse(200,{}, "Logout successful"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, {},`Logout Failed: ${error.message}`));
  }
};



export const updateUser = async(req, res) => {

    // So in this controller we'll only give the authority to the admin to update the skills and role
    const { skills = [], role , email} = req.body

    try {
        // Only admin and moderator can update their skills and profiles
        if(req.user?.role !== "admin"){
            return res.status(401).json(new ApiResponse(401,{},"Forbidden"))
        }
        
        const user = await User.findOne({email})
        if(!user) return res.status(404).status(new ApiResponse(404, {}, "User not found"))

        await User.updateOne(
            {email},
            {role , skills : skills.length ? skills : user.skills}
        )

        res.status(200).json(new ApiResponse(200,{},"User updated successfully"))

    } catch (error) {
        res.status(500).json(new ApiResponse(500,{},`Update Failed: ${error.message}`))
    }
}

export const getUsers = async(req, res) => {
    try {
        // Here in this function i will only give access to the admin and moderator to get all the users
        if(req.user?.role !== 'admin'){
            return res.status(403).json(new ApiResponse(403,{},"Forbidden"))
        }

        const users = await User.find().select("-password")
        res.status(200)
        .json(new ApiResponse(200,users,"Users fetched successfully"))

    } catch (error) {
        res.status(500).json(new ApiResponse(500,{},`Failed to get Users: ${error.message}`))
    }
}


// controller for searching the user on the basis of their email
export const searchUser = async(req, res) => {
  try {
    const {email} = req.params
    const users = await User.find(
      {
        email : {   
            $regex : email,
            $options : 'i'
        }
      }
    ).select("email role skills")
    if(!users) return res.status(404).json(new ApiResponse(404,{},"No user found"))

    return res.status(200).json(new ApiResponse(200,users,"Users found"))
  } catch (error) {
    return res.status(500).json(new ApiResponse(500,{},"Failed to fetch the user's data"))
  }
}


export const authenticateUser = async(req, res) => {
  return res.status(200).json({authenticated : true, user : req.user})
} 
