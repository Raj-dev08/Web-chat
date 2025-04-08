import { useState } from "react";
import { Camera, Mail, Loader2} from "lucide-react";
import toast from "react-hot-toast"
import { useFeedStore } from "../store/useFeedStore";

const CreatePost = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [ Description,setDescription] = useState("");
  const { isCreatingPost,uploadPost}=useFeedStore();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
    };
  };

  const handleDataChange=async(e)=>{
    e.preventDefault();

    if(!Description.trim()) return toast.error("Must enter description")
    if(!selectedImg) return toast.error("Must upload image")

    await uploadPost({description:Description,image:selectedImg});
  }

  return (
    
    <div className="h-screen pt-20">

      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Your Post</h1>
          </div>

          {/* avatar upload section */}
          <form onSubmit={handleDataChange}>


          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || "./public/avatar.png"}
                alt="Post"
                className="w-[100%] object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isCreatingPost ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isCreatingPost}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isCreatingPost ? "Uploading..." : "Click the camera icon to update your photo (must be less than 80kb)"}
            </p>
          </div>

            <div className="space-y-6">
           

           

            <div className="space-y-1.5 my-5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Description
              </div>
              <textarea
              type="text"
              className={`input input-bordered w-full pr-10 focus:outline-none h-[100px] `}
              placeholder="about you"
              value={Description}
              onChange={(e) => setDescription(e.target.value)
              }
            />
            </div>

            <button type="submit" className="btn btn-primary w-full mt-10" disabled={isCreatingPost}>
              {isCreatingPost ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Upload"
              )}
               
            </button>

          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePost