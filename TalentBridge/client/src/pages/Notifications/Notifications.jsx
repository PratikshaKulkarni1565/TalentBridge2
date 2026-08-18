import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import PageHero from "../../components/PageHero";

const API_ROOT = (import.meta.env.VITE_API_URL || "").replace("/api", "");

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const load = useCallback(async () => {
    const { data } = await api.get("/notifications");
    setNotifications(data);
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [load]);

  const markAllRead = async () => {
    await api.put("/notifications/read-all");
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1600&q=80"
        title="Notifications"
        subtitle={unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up!"}
        height={220}
      />
      <div className="page-container">
        <div className="feed-column">
          <div className="notifications-header">
            <h3>
              Recent Activity
              {unreadCount > 0 && <span className="notif-badge">{unreadCount} new</span>}
            </h3>
            <button onClick={markAllRead}>Mark all as read</button>
          </div>
          {notifications.length === 0 && <p className="muted">You have no notifications.</p>}
          {notifications.map((n) => (
            <div key={n._id} className={`notification-item ${n.isRead ? "" : "unread"}`} onClick={() => markRead(n._id)}>
              <img src={n.fromUser?.profilePicture ? `${API_ROOT}${n.fromUser.profilePicture}` : "https://via.placeholder.com/32"} alt="avatar" />
              <p><strong>{n.fromUser?.name || "Someone"}</strong> {n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
