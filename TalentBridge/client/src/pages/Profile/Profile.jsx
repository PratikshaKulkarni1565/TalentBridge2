import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import PostCard from "../../components/PostCard";
import ProfileStrengthMeter from "../../components/ProfileStrengthMeter";
import SkillChart from "../../components/SkillChart";
import PageHero from "../../components/PageHero";

const API_ROOT = (import.meta.env.VITE_API_URL || "").replace("/api", "");

const Profile = () => {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts]     = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ headline: "", about: "", location: "", skills: "" });

  const isOwnProfile = user && profile && user._id === profile._id;

  const load = useCallback(async () => {
    const { data: profileData } = await api.get(`/users/${id}`);
    setProfile(profileData);
    setForm({
      headline: profileData.headline || "",
      about:    profileData.about    || "",
      location: profileData.location || "",
      skills:   (profileData.skills  || []).join(", "),
    });
    const { data: postData } = await api.get(`/posts/user/${id}`);
    setPosts(postData);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    const { data } = await api.put("/users/profile", {
      headline: form.headline,
      about:    form.about,
      location: form.location,
      skills:   form.skills.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setProfile(data);
    setUser(data);
    setEditing(false);
  }, [form, setUser]);

  const handlePictureUpload = useCallback(async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);
    const { data } = await api.post("/users/upload-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setProfile(data);
    if (isOwnProfile) setUser(data);
  }, [isOwnProfile, setUser]);

  const handleConnect = useCallback(async () => {
    await api.post(`/connections/request/${id}`);
    alert("Connection request sent");
  }, [id]);

  const updatePost = useCallback((updated) =>
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p))), []);

  if (!profile) return (
    <div className="page-container">
      <div className="page-loader">Loading profile...</div>
    </div>
  );

  return (
    <div>      
      <PageHero
        image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80"
        title={profile.name}
        subtitle={profile.headline || "TalentBridge Member"}
        height={220}
      />
    <div className="page-container">
      <div className="profile-column">
        <motion.div
          className="profile-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="cover-photo"
            style={{ backgroundImage: profile.coverPicture ? `url(${API_ROOT}${profile.coverPicture})` : undefined }}
            role="img"
            aria-label="Cover photo"
          >
            {isOwnProfile && (
              <label className="cover-upload-label" aria-label="Change cover photo">
                Change cover
                <input type="file" accept="image/*" hidden onChange={(e) => handlePictureUpload(e, "cover")} />
              </label>
            )}
          </div>

          <div className="profile-info">
            <div className="profile-avatar-wrapper">
              <img
                src={profile.profilePicture ? `${API_ROOT}${profile.profilePicture}` : "https://via.placeholder.com/120"}
                alt={`${profile.name}'s avatar`}
                className="profile-avatar"
              />
              {isOwnProfile && (
                <label className="avatar-upload-label" aria-label="Change profile photo">
                  ✎
                  <input type="file" accept="image/*" hidden onChange={(e) => handlePictureUpload(e, "profile")} />
                </label>
              )}
            </div>
            <h2>{profile.name}</h2>
            <p className="muted">{profile.headline || "No headline set"}</p>
            <p className="muted">{profile.location}</p>

            {isOwnProfile ? (
              <button onClick={() => setEditing(!editing)} aria-expanded={editing}>
                {editing ? "Cancel" : "Edit Profile"}
              </button>
            ) : (
              <button onClick={handleConnect}>Connect</button>
            )}
          </div>

          {editing && (
            <motion.form
              onSubmit={handleSave}
              className="edit-profile-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label htmlFor="headline">Headline</label>
              <input id="headline" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="e.g. Software Engineering Student" />
              <label htmlFor="location">Location</label>
              <input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <label htmlFor="about">About</label>
              <textarea id="about" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
              <label htmlFor="skills">Skills (comma separated)</label>
              <input id="skills" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
              <button type="submit">Save Changes</button>
            </motion.form>
          )}

          {!editing && (
            <div className="profile-details">
              {profile.about && (
                <div>
                  <h3>About</h3>
                  <p>{profile.about}</p>
                </div>
              )}
              {profile.skills?.length > 0 && (
                <div>
                  <h3>Skills</h3>
                  <div className="skill-tags">
                    {profile.skills.map((s, i) => (
                      <span key={i} className="skill-tag">{s}</span>
                    ))}
                  </div>
                  <SkillChart skills={profile.skills} />
                </div>
              )}
            </div>
          )}
        </motion.div>

        {isOwnProfile && <ProfileStrengthMeter profile={profile} />}

        <h3>Posts</h3>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onUpdate={updatePost} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default Profile;
