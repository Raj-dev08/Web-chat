import { useState, useEffect, useRef, use } from "react";
import { useFeedStore } from "../store/useFeedStore";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { FaComment , FaCommentSlash } from "react-icons/fa";

const HomePage = () => {
  const { getPost, feedPost, isLoadingPost, hasMorePost, likePost, commentPost } = useFeedStore();
  const { authUser } = useAuthStore();
  const limit = 2;
  const observerRef = useRef(null);
  const [page, setPage] = useState(1);
  const [times, setTimes] = useState(0);

  const [comment, setComment] = useState("");
  const [activePostId, setActivePostId] = useState(null);
  const [userComment, setUserComment] = useState(comment);

  const handleCommentSubmit = async (postId) => {
    if (!comment.trim()) return; // Prevent empty comments
    commentPost(postId, comment); // Call the commentPost function from Zustand
    setUserComment(comment); // Set the comment to the state
    setComment(""); // Clear the input field
    setActivePostId(null); // Close the comment input after submission
  };

  // Fetch posts when the component mounts or when the page changes
  useEffect(() => {
    getPost(limit, times, () => setTimes((prevTimes) => prevTimes + 1));
  }, [page, getPost]); // Add page and getPost as dependencies

  // Infinite scrolling logic
  useEffect(() => {
    if (!hasMorePost || !observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingPost && hasMorePost) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.2 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMorePost, isLoadingPost]);

  return (
    <div className="pt-16 container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedPost.map((post) => (
          <div key={post._id} className="shadow-md rounded-lg overflow-hidden border-2">
            <div className="flex items-center p-4">
              <img
                src={post.user.profilePic || "/avatar.png"}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <Link to="/messages">
                <div className="ml-3">
                  <p className="font-semibold">{post.user.name}</p>
                  <p className="text-sm">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </Link>
            </div>

            <img src={post.image} alt="Post" className="w-full h-64 object-contain" />

            <div className="p-4">
              <p className="font-semibold">{post.description}</p>
              <div className="flex items-center mt-4">
                <button
                  onClick={() => likePost(post._id, authUser)}
                  className="flex items-center space-x-2 text-blue-500"
                >
                  {post.likes.includes(authUser._id) ? (
                    <AiFillLike size={24} />
                  ) : (
                    <AiOutlineLike size={24} />
                  )}
                  <span>{post.likes.length+128}</span>
                </button>
              </div>

              {/* Comment Section */}
              <div className="mt-4">
                <button
                  onClick={() => setActivePostId(activePostId === post._id ? null : post._id)}
                  className="text-blue-500"
                >
                  {activePostId === post._id ? <FaCommentSlash /> : <FaComment />}
                </button>
                {activePostId === post._id && (
                  <div className="mt-4">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                      placeholder="Write a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      onClick={() => handleCommentSubmit(post._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                    >
                      Submit
                    </button>
                  </div>
                )}
                 <h3 className="font-semibold">Comments:</h3>
                <div className="mt-4 overflow-scroll max-h-20">
                  {post.comments.map((comment) => (
                    <div key={comment?._id} className="mt-2">
                      <p className="flex items-center space-x-2">
                        <img
                          src={comment?.userProfilePic || authUser.profilePic || "/avatar.png"}
                          alt="User"
                          className="w-5 h-5 rounded-full object-cover "
                        />
                        <strong>{comment?.username||authUser.name}:</strong> {comment?.text||userComment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isLoadingPost && <p className="text-center mt-4">Loading...</p>}
      {!hasMorePost && <p className="text-center mt-4">No more posts to load.</p>}
      <div ref={observerRef} className="h-10"></div>{/* bottom of the page div to keep track of scroll */}
    </div>
  );
};

export default HomePage;
