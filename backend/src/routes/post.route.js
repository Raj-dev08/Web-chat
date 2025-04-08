import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createPost,getPost ,getUserPost ,likePost ,deletePost ,commentPost} from '../controllers/post.controller.js';


const router = express.Router();


router.get("/get-post", protectRoute, getPost);
router.get("/get-user-post", protectRoute, getUserPost);
router.post("/:postId/like",protectRoute,likePost);
router.post("/:postId/comments",protectRoute,commentPost);
router.post("/create-post", protectRoute, createPost);
router.delete("/:postId/delete", protectRoute, deletePost);

export default router;