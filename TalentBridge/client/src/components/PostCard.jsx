import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiMessageCircle, FiBookmark } from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const API_ROOT = (import.meta.env.VITE_API_URL || "").replace("/api", "");

const PostCard = React.memo(({ post, onUpdate }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [saved, setSaved] = useState(() => {
    const s = JSON.parse(localStorage.getItem("tb_saved_posts") || "[]");
    return s.includes(post._id);
  });

  const isLiked = post.likes?.some((id) => id === user._id || id?._id === user._id);

  const handleLike = useCallback(async () => {
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    const wasLiked = isLiked;
    const optimistic = {
      ...post,
      likes: wasLiked
        ? post.likes.filter((id) => (id?._id || id) !== user._id)
        : [...(post.likes || []), user._id],
    };
    onUpdate(optimistic);
    try {
      const { data } = await api.put(`/posts/${post._id}/like`);
      onUpdate(data);
    } catch {
      onUpdate(post);
    }
  }, [isLiked, post, user._id, onUpdate]);

  const handleComment = useCallback(async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const { data } = await api.post(`/posts/${post._id}/comment`, { text: commentText });
    onUpdate(data);
    setCommentText("");
  }, [commentText, post._id, onUpdate]);

  const handleSave = useCallback(() => {
    const list = JSON.parse(localStorage.getItem("tb_saved_posts") || "[]");
    const data = JSON.parse(localStorage.getItem("tb_saved_posts_data") || "[]");
    if (list.includes(post._id)) {
      localStorage.setItem("tb_saved_posts", JSON.stringify(list.filter((id) => id !== post._id)));
      localStorage.setItem("tb_saved_posts_data", JSON.stringify(data.filter((p) => p._id !== post._id)));
      setSaved(false);
    } else {
      localStorage.setItem("tb_saved_posts", JSON.stringify([...list, post._id]));
      localStorage.setItem("tb_saved_posts_data", JSON.stringify([...data, post]));
      setSaved(true);
    }
  }, [post]);

  return (
    <motion.div
      className="post-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      layout
    >
      <div className="post-header">
        <img
          src={post.userId?.profilePicture ? `${API_ROOT}${post.userId.profilePicture}` : "https://via.placeholder.com/40"}
          alt="avatar"
        />
        <div>
          <strong>{post.userId?.name}</strong>
          <p className="muted">{post.userId?.headline}</p>
        </div>
      </div>

      {post.text && <div className="post-text" dangerouslySetInnerHTML={{ __html: post.text }} />}
      {post.image && <img className="post-image" src={`${API_ROOT}${post.image}`} alt="post" />}

      <div className="post-actions">
        <button
          onClick={handleLike}
          className={isLiked ? "liked" : ""}
          aria-label={isLiked ? "Unlike post" : "Like post"}
        >
          <motion.span
            animate={likeAnim ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 0.3 }}
            style={{ display: "inline-flex" }}
          >
            <FiHeart />
          </motion.span>
          {" "}{post.likes?.length || 0}
        </button>
        <button onClick={() => setShowComments(!showComments)} aria-label="Toggle comments">
          <FiMessageCircle /> {post.comments?.length || 0}
        </button>
        <button onClick={handleSave} className={saved ? "saved" : ""} aria-label={saved ? "Unsave post" : "Save post"}>
          <FiBookmark /> {saved ? "Saved" : "Save"}
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            className="comments-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {post.comments?.map((c) => (
              <div key={c._id} className="comment">
                <strong>{c.userId?.name || "User"}</strong>: {c.text}
              </div>
            ))}
            <form onSubmit={handleComment} className="comment-form">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                aria-label="Comment text"
              />
              <button type="submit">Post</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

PostCard.displayName = "PostCard";
export default PostCard;
