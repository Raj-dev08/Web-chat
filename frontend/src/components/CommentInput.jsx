import { useState } from "react";
import { useFeedStore } from "../store/useFeedStore";

const CommentInput = ({ postId }) => {
  const { commentPost } = useFeedStore(); // Access the commentPost function from the store
  const [comment, setComment] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return; // Prevent empty comments
    await commentPost(postId, comment); // Call the commentPost function
    setComment(""); // Clear the input field after submission
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 flex items-center space-x-4">
      <input
        type="text"
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={handleCommentSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Send
      </button>
    </div>
  );
};

export default CommentInput;