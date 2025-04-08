import { text } from "express";
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },   
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default:[],
        },
        comments:[
            {
                text:{
                    type:String,
                    required:true
                },
                username:{
                    type:String,
                    required:true
                },
                userProfilePic:{
                    type:String,
                    required:true
                },
                createdAt: { type: Date, default: Date.now },
            }
        ]
    },
    {timestamps:true}
)

const Post = mongoose.model("Post", postSchema)
export default Post;