import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useFeedStore= create((set,get)=>({
    feedPost:[],
    isLoadingPost:false,
    isCreatingPost:false,
    userPost:[],
    isGettingUserPost:false,
    hasMorePost:true,
    isLikingPost:false,
    

    uploadPost: async(data)=>{
        set({isCreatingPost:true});
        
        try {
            const res=await axiosInstance.post("/posts/create-post",data);
            toast.success("Post created succesfully");
            set((state) => ({
                feedPost: [res.data.post, ...state.feedPost], // Add the new post to the top
              }));
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response?.data?.message||"something went wrong");
        }finally{
            set({isCreatingPost:false});
        }
    },

    getPost: async(limit,times,incrementTimes)=>{
        if (get().isLoadingPost) return;
        if(!get().hasMorePost)return;
        
        // console.log("Fetching posts for page:", page, "limit:", limit);
        set({isLoadingPost:true});
        try {
            const res = await axiosInstance.get(`/posts/get-post?limit=${limit}&times=${times}`);
            set((state) => ({
              feedPost: [...state.feedPost, ...res.data.post], // Combine existing and new posts
              hasMorePost: res.data.hasMore,//the feedpost cant be normally appended as it is creating duplicates cause fast execution
              isLoadingPost: false,
            }));  
            if (incrementTimes) incrementTimes();
            // console.log("Fetched posts:", res.data.post);
            // console.log("Has more:", res.data.hasMore); 
        } catch (error) {
            console.log("error in getpost:", error);
            toast.error(error.response?.data?.message||"something went wrong");
            set({isLoadingPost:false});
        }
    },

    getUserPost: async()=>{
        set({isGettingUserPost:true});
        try {
            const res= await axiosInstance.get("/posts/get-user-post");
            set({userPost: [...res.data.post]});
        } catch (error) {
            console.log("error in get user post:", error);
            toast.error(error.response?.data?.message||"something went wrong");
        }finally{
            set({isGettingUserPost:false});
        }
    },

    likePost: async(postId,authUser)=>{
        if(get().isLikingPost)return

        set({isLikingPost:true});

        const updatedFeedPost = get().feedPost.map((post) => {
            if (post._id === postId) {
                const isLiked = post.likes.includes(authUser._id);
                return {
                    ...post,
                    likes: isLiked
                        ? post.likes.filter((id) => id !== authUser._id) // Remove like
                        : [...post.likes, authUser._id], // Add like
                };
            }
            return post;
        });
        set({ feedPost: updatedFeedPost });
        
        try {
            const res=await axiosInstance.post(`/posts/${postId}/like`);
            toast.success(res.data.message)
        } catch (error) {
            console.log("error in getpost:", error);
            toast.error(error.response?.data?.message||"something went wrong");

            const revertedFeedPost = get().feedPost.map((post) => {
                if (post._id === postId) {
                    const isLiked = post.likes.includes(authUser._id);
                    return {
                        ...post,
                        likes: isLiked
                            ? [...post.likes, authUser._id] // Re-add like
                            : post.likes.filter((id) => id !== authUser._id), // Remove like
                    };
                }
                return post;
            });
            set({ feedPost: revertedFeedPost });
        }finally{
            set({isLikingPost:false});
        }
    },
    likePostUser: async(postId,authUser)=>{
        if(get().isLikingPost)return

        set({isLikingPost:true});

        const updatedFeedPost = get().userPost.map((post) => {
            if (post._id === postId) {
                const isLiked = post.likes.includes(authUser._id);
                return {
                    ...post,
                    likes: isLiked
                        ? post.likes.filter((id) => id !== authUser._id) // Remove like
                        : [...post.likes, authUser._id], // Add like
                };
            }
            return post;
        });
        set({ userPost: updatedFeedPost });
        
        try {
            const res=await axiosInstance.post(`/posts/${postId}/like`);
            toast.success(res.data.message)
        } catch (error) {
            console.log("error in getpost:", error);
            toast.error(error.response?.data?.message||"something went wrong");

            const revertedFeedPost = get().userPost.map((post) => {
                if (post._id === postId) {
                    const isLiked = post.likes.includes(authUser._id);
                    return {
                        ...post,
                        likes: isLiked
                            ? [...post.likes, authUser._id] // Re-add like
                            : post.likes.filter((id) => id !== authUser._id), // Remove like
                    };
                }
                return post;
            });
            set({ userPost: revertedFeedPost });
        }finally{
            set({isLikingPost:false});
        }
    },
    deletePost: async(postId)=>{
        try {
            const res = await axiosInstance.delete(`/posts/${postId}/delete`);
            toast.success(res.data.message);
            set((state) => ({
                feedPost: state.feedPost.filter((post) => post._id !== postId),
            }));
            set((state) => ({
                userPost: state.userPost.filter((post) => post._id !== postId),
            }));
            
        } catch (error) {
            console.log("error in delete post:", error);
            toast.error(error.response?.data?.message||"something went wrong")
        }
    },
    commentPost: async(postId,text)=>{
        try {
            const res=await axiosInstance.post(`/posts/${postId}/comments`,{text});
            set((state) => ({
                feedPost: state.feedPost.map((post) => {
                    if (post._id === postId) {
                        return {
                            ...post,
                            comments: [...post.comments, res.data.comment],
                        };
                    }
                    return post;
                }),
            }));
            toast.success("Comment added successfully")
        } catch (error) {
            console.log("error in comment post:", error);
            toast.error(error.response?.data?.message||"something went wrong")
        }
    }
}));