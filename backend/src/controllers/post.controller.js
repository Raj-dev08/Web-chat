import Post from "../models/post.model.js";  
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";

export const createPost = async (req,res) => {
    try {
        const {description,image} = req.body;
        const {user} = req;
        
        if(!description || !image){
            return res.status(400).json({message: "Please provide all the fields"});
        }

        if(!user){  
            return res.status(401).json({message: "Unauthorized must be logged in"});
        }
          
        const uploadedResponse = await cloudinary.uploader.upload(image);

        const newPost = new Post({
            description,
            image:uploadedResponse.secure_url,
            user: user._id
        });
        await newPost.save();
        
        res.status(201).json({
            message: "Post created successfully",
            post: {
                id: newPost._id,
                description: newPost.description,
                image: newPost.image,
                user: newPost.user,
                createdAt: newPost.createdAt
            }
        });
    } catch (error) {
        console.log("Error in createPost controller", error.message);
        res.status(500).json({message: "Internal Server Error"});  
    }
}

export const getUserPost = async (req,res)=>{
    try {
        const {user}=req;

        if(!user){
            return res.status(401).json({message:"Unothorized user is not logged in"})
        }

        const post=await Post.find({user:user}).populate("user","name email");

        if(!post||post.length===0){
            return res.status(404).json({message: "No Post found for this user"});
        }

        return res.status(200).json({post});
    } catch (error) {
        console.log("Error in getUserPost controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export const getPost = async (req,res) => {
    try {
        const limit=parseInt(req.query.limit)|| 10;
        const times=parseInt(req.query.times)||0;
        const skip = times * limit;

        
        const post = await Post.find().populate("user", "name email profilePic")
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit);

        if(post.length===0){
            return res.status(200).json({ post: [], hasMore: false })
        }

        const totalPosts = await Post.countDocuments();
        // console.log(`totalpost=${totalPosts}`);
        // console.log(`skip=${skip}`);
        // console.log(`post.length=${post.length}`);
        // console.log(`limit=${limit}`);
        // console.log(`times=${times}`)
        // console.log("done");
        // console.log("");
        const hasMore = skip + post.length < totalPosts;    

        return res.status(200).json({post,hasMore});
    } catch (error) {
        console.log("Error in getPost controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const likePost = async (req,res)=>{
    try {
        const {postId} =req.params;
        const { user }=req;

        if(!mongoose.Types.ObjectId.isValid(postId)||!mongoose.Types.ObjectId.isValid(user._id)){
            return res.status(400).json({message:"Invalid ids"});
        }

        const post =await Post.findById(postId);
        const userId=user._id.toString();

        if(!post){
            return res.status(404).json({message:"Post not found"});
        }

        const isLiked= post.likes.includes(userId);

        if(isLiked){
            post.likes=post.likes.filter((id)=>id.toString()!==userId);
        }else{
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json({message: isLiked?"Disliked succesfully":"Liked succesfully",likes : post.likes.length});
    } catch (error) {
        console.log("Error in likePost controller",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}

export const deletePost =async (req,res)=>{
    try {
        const {postId} = req.params;

        await Post.findByIdAndDelete(postId);

        res.status(200).json({message:"Post deleted successfully"});
    } catch (error) {
        console.log("Error in deletepost controller",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}

export const commentPost = async (req,res)=>{
    try {
        const {postId} = req.params;
        const {text} = req.body;
        const {user}=req;

        if(!mongoose.Types.ObjectId.isValid(postId)||!mongoose.Types.ObjectId.isValid(user._id)){
            return res.status(400).json({message:"Invalid ids"});
        }

        if(!text){
            return res.status(400).json({message:"Comment text is required"});
        }

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message:"Post not found"});
        }

        post.comments.push({
            text,
            username:user.name,
            userProfilePic:user.profilePic,
            createdAt: new Date()
        });

        await post.save();

        res.status(200).json({message:"Comment added successfully",comments:post.comments});
    } catch (error) {
        console.log("Error in commentPost controller",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}