import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useFeedStore } from "../store/useFeedStore";
import { Camera, Mail, User ,Loader2} from "lucide-react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { Trash2 } from 'lucide-react';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const { getUserPost , isGettingUserPost, userPost ,likePostUser, deletePost} = useFeedStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [ Description,setDescription] = useState(authUser?.description);
  const [ Name,setName] = useState(authUser?.name);


  useEffect(()=>{
    getUserPost();
  },[]);

  if(isGettingUserPost)return(
   <Loader2 className="h-5 w-5 animate-spin" />
  )

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image});
    };
  };

  const handleDataChange=async(e)=>{
    e.preventDefault();

    if(!Description.trim()) return toast.error("Must enter description")
    if(!Name.trim()) return toast.error("Must enter Name")

    await updateProfile({description:Description,name:Name});
  }

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "./public/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

         

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address (can't change)
              </div>
              <p className="input input-bordered w-full pl-10">{authUser?.email}</p>
            </div>

            <div className="space-y-6">
           

            <form onSubmit={handleDataChange}>

            <div className="space-y-1.5 my-5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <input
              type="text"
              className={`input input-bordered w-full pl-10 focus:outline-none `}
              placeholder="Your name"
              value={Name}
              onChange={(e) => setName(e.target.value)
              }
              />
            </div>

            <div className="space-y-1.5 my-5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Description
              </div>
              <input
              type="text"
              className={`input input-bordered w-full pl-10 focus:outline-none`}
              placeholder="about you"
              value={Description}
              onChange={(e) => setDescription(e.target.value)
              }
            />
            </div>

            <button type="submit" className="btn btn-primary w-full mt-10" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "UPDATE"
              )}
            </button>

            </form>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-2xl font-semibold text-center m-10">Your Posts</p>
      </div>
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {userPost.map((post) => (
        <div key={post._id} className="shadow-md rounded-lg overflow-hidden border-2">
          <div className="flex items-center p-4">
            <img
              src={post.user.profilePic || authUser.profilePic|| "/avatar.png"}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="font-semibold">{post.user.name}</p>
              <p className="text-sm">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <img
            src={post.image}
            alt="Post"
            className="w-full h-64 object-contain"
          />

          <div className="p-4">
            <p className="font-semibold">{post.description}</p>
            <div className="flex items-center mt-4">
                <button
                  onClick={() => likePostUser(post._id,authUser)}
                  className="flex items-center space-x-2 text-blue-500"
                >
                  {post.likes.includes(authUser._id)? (
                    <AiFillLike size={24} />
                  ) : (
                    <AiOutlineLike size={24} />
                  )}
                  <span>{post.likes.length}</span>
                </button>
                <button
                  onClick={() => deletePost(post._id)}
                  className="flex items-center space-x-2 text-red-500 ml-4"
                ><Trash2 size={24} />
                  <span>Delete</span>
                </button>
              </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};
export default ProfilePage;
