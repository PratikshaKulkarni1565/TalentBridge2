import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX, FiImage, FiBriefcase, FiUsers, FiMessageSquare,
  FiBell, FiTrendingUp, FiBookmark, FiEdit3, FiMapPin,
  FiCalendar, FiChevronRight, FiPlus, FiStar, FiZap,
} from "react-icons/fi";
import api from "../../services/api";
import PostCard from "../../components/PostCard";
import SkeletonCard from "../../components/SkeletonCard";
import RichTextEditor from "../../components/RichTextEditor";
import { useAuth } from "../../context/AuthContext";

const API_ROOT = (import.meta.env.VITE_API_URL || "").replace("/api", "");
const PAGE_SIZE = 5;

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

// ── Glassmorphism card wrapper ────────────────────────────────────────────────
const GlassCard = ({ children, className = "", ...props }) => (
  <div className={`glass-card ${className}`} {...props}>{children}</div>
);

// ── Create Post Modal ─────────────────────────────────────────────────────────
const CreatePostModal = ({ user, onPost, onClose }) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [plainText, setPlainText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posting, setPosting] = useState(false);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const handlePost = useCallback(async (e) => {
    e.preventDefault();
    if (!plainText.trim() && !image) return;
    setPosting(true);
    try {
      const formData = new FormData();
      formData.append("text", htmlContent);
      if (image) formData.append("image", image);
      const { data } = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onPost(data);
      onClose();
    } finally {
      setPosting(false);
    }
  }, [plainText, image, htmlContent, onPost, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-panel"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="modal-user-info">
              <img
                src={user?.profilePicture ? `${API_ROOT}${user.profilePicture}` : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "U") + "&background=00A896&color=fff"}
                alt="avatar"
                className="modal-avatar"
              />
              <div>
                <p className="modal-user-name">{user?.name}</p>
                <p className="modal-user-sub">{user?.headline || "TalentBridge Member"}</p>
              </div>
            </div>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close"><FiX /></button>
          </div>

          <form onSubmit={handlePost} className="modal-form">
            <RichTextEditor
              autoFocus
              onContentChange={(html, text) => { setHtmlContent(html); setPlainText(text); }}
              placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`}
            />
            {preview && (
              <div className="modal-preview-wrapper">
                <img src={preview} alt="preview" className="modal-preview-img" />
                <button type="button" className="modal-remove-img" onClick={() => { setImage(null); setPreview(null); }} aria-label="Remove image"><FiX /></button>
              </div>
            )}
            <div className="modal-actions">
              <label className="modal-img-btn" title="Add image">
                <FiImage />
                <span>Photo</span>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              </label>
              <button type="submit" className="modal-post-btn" disabled={posting || (!plainText.trim() && !image)}>
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Left Sidebar ──────────────────────────────────────────────────────────────
const LeftSidebar = ({ user }) => {
  const avatarSrc = user?.profilePicture
    ? `${API_ROOT}${user.profilePicture}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=00A896&color=fff&size=80`;

  const savedPosts = JSON.parse(localStorage.getItem("tb_saved_posts_data") || "[]");

  const completionItems = [
    { label: "Profile photo", done: !!user?.profilePicture },
    { label: "Headline", done: !!user?.headline },
    { label: "Skills added", done: (user?.skills?.length || 0) > 0 },
    { label: "Bio written", done: !!user?.bio },
  ];
  const completionPct = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  return (
    <motion.aside
      className="sidebar-left"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Profile Card */}
      <motion.div variants={fadeUp}>
        <GlassCard className="profile-card-sidebar">
          <div className="profile-card-cover" />
          <div className="profile-card-body">
            <img src={avatarSrc} alt="avatar" className="profile-card-avatar" />
            <h3 className="profile-card-name">{user?.name}</h3>
            <p className="profile-card-headline">{user?.headline || "TalentBridge Member"}</p>
            {user?.location && (
              <p className="profile-card-location"><FiMapPin size={12} /> {user.location}</p>
            )}
            <Link to={`/profile/me`} className="profile-card-btn">View Profile</Link>
          </div>
          <div className="profile-card-stats">
            <div className="profile-stat">
              <span className="profile-stat-val">—</span>
              <span className="profile-stat-lbl">Connections</span>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat">
              <span className="profile-stat-val">—</span>
              <span className="profile-stat-lbl">Post views</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Profile Completion */}
      <motion.div variants={fadeUp}>
        <GlassCard>
          <div className="sidebar-section-title">
            <FiZap size={14} /> Profile Strength
          </div>
          <div className="completion-bar-track">
            <motion.div
              className="completion-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
          <p className="completion-pct">{completionPct}% complete</p>
          <div className="completion-items">
            {completionItems.map((item) => (
              <div key={item.label} className={`completion-item ${item.done ? "done" : ""}`}>
                <span className="completion-dot">{item.done ? "✓" : "○"}</span>
                {item.label}
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp}>
        <GlassCard>
          <div className="sidebar-section-title"><FiStar size={14} /> Quick Actions</div>
          <div className="quick-actions">
            {[
              { icon: <FiBriefcase size={15} />, label: "Browse Jobs", to: "/jobs" },
              { icon: <FiUsers size={15} />, label: "Find People", to: "/connections" },
              { icon: <FiMessageSquare size={15} />, label: "Messages", to: "/messages" },
              { icon: <FiBell size={15} />, label: "Notifications", to: "/notifications" },
            ].map((a) => (
              <Link key={a.label} to={a.to} className="quick-action-item">
                <span className="quick-action-icon">{a.icon}</span>
                <span>{a.label}</span>
                <FiChevronRight size={13} className="quick-action-arrow" />
              </Link>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Saved Posts */}
      {savedPosts.length > 0 && (
        <motion.div variants={fadeUp}>
          <GlassCard>
            <div className="sidebar-section-title"><FiBookmark size={14} /> Saved Posts</div>
            <div className="saved-posts-list">
              {savedPosts.slice(0, 3).map((p) => (
                <div key={p._id} className="saved-post-item">
                  <p className="saved-post-author">{p.userId?.name}</p>
                  <p className="saved-post-preview" dangerouslySetInnerHTML={{ __html: p.text?.slice(0, 60) + "…" }} />
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </motion.aside>
  );
};

// ── Right Sidebar ─────────────────────────────────────────────────────────────
const RightSidebar = () => {
  const TRENDING = [
    { tag: "#OpenToWork", posts: "2.4k posts" },
    { tag: "#TechJobs2025", posts: "1.8k posts" },
    { tag: "#RemoteWork", posts: "3.1k posts" },
    { tag: "#AIEngineering", posts: "980 posts" },
    { tag: "#CareerGrowth", posts: "1.2k posts" },
  ];

  const JOBS = [
    { title: "Senior React Developer", company: "TechCorp", location: "Remote", type: "Full-time" },
    { title: "Product Designer", company: "DesignHub", location: "New York", type: "Hybrid" },
    { title: "Data Scientist", company: "DataFlow", location: "San Francisco", type: "On-site" },
  ];

  const EVENTS = [
    { title: "Tech Networking Night", date: "Jul 28", attendees: 142 },
    { title: "Career Fair 2025", date: "Aug 5", attendees: 380 },
  ];

  return (
    <motion.aside
      className="sidebar-right"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Trending */}
      <motion.div variants={fadeUp}>
        <GlassCard>
          <div className="sidebar-section-title"><FiTrendingUp size={14} /> Trending Topics</div>
          <div className="trending-list">
            {TRENDING.map((t) => (
              <div key={t.tag} className="trending-item">
                <span className="trending-tag">{t.tag}</span>
                <span className="trending-count">{t.posts}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Recommended Jobs */}
      <motion.div variants={fadeUp}>
        <GlassCard>
          <div className="sidebar-section-title"><FiBriefcase size={14} /> Recommended Jobs</div>
          <div className="jobs-list">
            {JOBS.map((j) => (
              <Link to="/jobs" key={j.title} className="job-item">
                <div className="job-item-icon"><FiBriefcase size={16} /></div>
                <div className="job-item-info">
                  <p className="job-item-title">{j.title}</p>
                  <p className="job-item-meta">{j.company} · {j.location}</p>
                  <span className="job-item-badge">{j.type}</span>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/jobs" className="sidebar-see-all">See all jobs <FiChevronRight size={13} /></Link>
        </GlassCard>
      </motion.div>

      {/* Events */}
      <motion.div variants={fadeUp}>
        <GlassCard>
          <div className="sidebar-section-title"><FiCalendar size={14} /> Upcoming Events</div>
          <div className="events-list">
            {EVENTS.map((ev) => (
              <div key={ev.title} className="event-item">
                <div className="event-date-badge">{ev.date}</div>
                <div>
                  <p className="event-title">{ev.title}</p>
                  <p className="event-attendees">{ev.attendees} attending</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Suggested Connections */}
      <motion.div variants={fadeUp}>
        <GlassCard>
          <div className="sidebar-section-title"><FiUsers size={14} /> People You May Know</div>
          <div className="suggestions-list">
            {["Alex Chen", "Maria Santos", "James Wright"].map((name) => (
              <div key={name} className="suggestion-item">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=36`}
                  alt={name}
                  className="suggestion-avatar"
                />
                <div className="suggestion-info">
                  <p className="suggestion-name">{name}</p>
                  <p className="suggestion-role">Software Engineer</p>
                </div>
                <button className="suggestion-connect-btn"><FiPlus size={13} /></button>
              </div>
            ))}
          </div>
          <Link to="/connections" className="sidebar-see-all">See all <FiChevronRight size={13} /></Link>
        </GlassCard>
      </motion.div>
    </motion.aside>
  );
};

// ── Center Feed ───────────────────────────────────────────────────────────────
const Home = ({ newPostSignal = 0 }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const loaderRef = useRef(null);
  const pageRef = useRef(1);

  const fetchFeed = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/posts/feed?page=${pageNum}&limit=${PAGE_SIZE}`);
      const newPosts = Array.isArray(data) ? data : data.posts || data;
      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => {
          const ids = new Set(prev.map((p) => p._id));
          return [...prev, ...newPosts.filter((p) => !ids.has(p._id))];
        });
      }
      if (newPosts.length < PAGE_SIZE) setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { pageRef.current = 1; fetchFeed(1); }, [fetchFeed]);

  useEffect(() => {
    if (newPostSignal > 0) setModalOpen(true);
  }, [newPostSignal]);

  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
            pageRef.current += 1;
            fetchFeed(pageRef.current);
          }
      },
      { threshold: 0.1 }
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasMore, loading, fetchFeed]);

  const updatePost = useCallback((updated) =>
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p))), []);

  const addPost = useCallback((newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setModalOpen(false);
  }, []);

  const avatarSrc = user?.profilePicture
    ? `${API_ROOT}${user.profilePicture}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=00A896&color=fff&size=40`;

  return (
    <div className="dashboard-root">
      <div className="dashboard-grid">
        <LeftSidebar user={user} />

        {/* Center Column */}
        <main className="dashboard-center">
          {/* Welcome Banner */}
          <motion.div
            className="welcome-banner"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="welcome-text">
              <h2 className="welcome-heading">Welcome back, {user?.name?.split(" ")[0]} 👋</h2>
              <p className="welcome-sub">Here's what's happening in your network today.</p>
            </div>
          </motion.div>

          {/* Create Post Trigger */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <GlassCard className="create-post-trigger">
              <img src={avatarSrc} alt="avatar" className="create-post-avatar" />
              <button
                className="create-post-placeholder"
                onClick={() => setModalOpen(true)}
              >
                What's on your mind, {user?.name?.split(" ")[0]}?
              </button>
              <button className="create-post-icon-btn" onClick={() => setModalOpen(true)} aria-label="Create post">
                <FiEdit3 size={16} />
              </button>
            </GlassCard>
          </motion.div>

          {/* Feed */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="feed-wrapper"
          >
            <AnimatePresence initial={false}>
              {loading && posts.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <motion.div key={i} variants={fadeUp}><SkeletonCard /></motion.div>
                  ))
                : posts.map((post) => (
                    <motion.div key={post._id} variants={fadeUp} layout>
                      <PostCard post={post} onUpdate={updatePost} />
                    </motion.div>
                  ))}
            </AnimatePresence>
            <div ref={loaderRef} style={{ height: 20 }} aria-hidden="true" />
            {loading && posts.length > 0 && <SkeletonCard />}
            {!hasMore && posts.length > 0 && (
              <p className="feed-end-msg">You're all caught up 🎉</p>
            )}
          </motion.div>
        </main>

        <RightSidebar />
      </div>

      {/* Create Post Modal */}
      {modalOpen && (
        <CreatePostModal user={user} onPost={addPost} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default Home;
