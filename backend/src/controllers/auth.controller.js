import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { name, email,description, password } = req.body;
    try {

        if(!name || !email  || !password){
            return res.status(400).json({message: "All fields are required"});
        }
    
        if(password.length < 4){
            return res.status(400).json({message: "Password must be atleast 4 characters long"});
        }
    
        const user = await User.findOne({email});
    
        if(user){
            return res.status(400).json({message: "User with the email already exists"});
        }

        //const salt = await bcrypt.genSalt(10);
        //const hashedPassword = await bcrypt.hash(password, salt);
        //comment out for some reason now gonna add later
        const newUser = new User({
            name,
            email, 
            description, 
            password
        });

        if (newUser) {
            // generate jwt token here
            generateToken(newUser._id, res);
            await newUser.save();
      
            res.status(201).json({
              _id: newUser._id,
              fullName: newUser.fullName,
              email: newUser.email,
              profilePic: newUser.profilePic,
            });
          } else {
            res.status(400).json({ message: "Invalid user data" });
          }
        } catch (error) {
          console.log("Error in signup controller", error.message);
          res.status(500).json({ message: "Internal Server Error" });
        }
};


export const login = async (req, res) => {
    const {email,password} = req.body;

    try {
        
        const user= await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "User with the email does not exist"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"});
        }


        generateToken(user._id, res);
        
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            description: user.description,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }

}


export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "",{maxAge:0});
        res.status(200).json({message: "User logged out successfully"});    
    } catch (error) {
        console.log("Error in logout:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const updateProfile = async (req, res) => {
    try {
      const { profilePic, description , name} = req.body;
      const userId = req.user._id;
  
      if (!profilePic && !description) {
        return res.status(400).json({ message: "Please provide a profile picture or description" });
      }
  
      const updateData = {};
  
      // Handle profile picture upload
      if (profilePic) {
        const uploadedResponse = await cloudinary.uploader.upload(profilePic);
        updateData.profilePic = uploadedResponse.secure_url;
      }
  
      // Handle description update
      if (description) {
        updateData.description = description;
      }

      if (name) {
        updateData.name = name;
      }
  
      // Update user in the database
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error in updateProfile controller:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const checkAuth = (req, res) => {
    try {
      if(!req.user){
        res.status(401).json({message : "unauthorized access"});
      }  
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
