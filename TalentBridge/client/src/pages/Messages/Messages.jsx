import React, { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import PageHero from "../../components/PageHero";

const API_ROOT = (import.meta.env.VITE_API_URL || "").replace("/api", "");

const Messages = () => {
  const { user }                          = useAuth();
  const [conversations, setConversations] = useState([]);
  const [connections, setConnections]     = useState([]);
  const [activeUser, setActiveUser]       = useState(null);
  const [chat, setChat]                   = useState([]);
  const [text, setText]                   = useState("");
  const bottomRef                         = useRef(null);

  const loadSidebar = async () => {
    const [{ data: convData }, { data: connData }] = await Promise.all([
      api.get("/messages"),
      api.get("/connections"),
    ]);
    setConversations(convData);
    setConnections(connData);
  };

  useEffect(() => { loadSidebar(); }, []);

  const openChat = async (otherUser) => {
    setActiveUser(otherUser);
    const { data } = await api.get(`/messages/${otherUser._id}`);
    setChat(data);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeUser) return;
    const { data } = await api.post(`/messages/${activeUser._id}`, { message: text });
    setChat([...chat, data]);
    setText("");
    loadSidebar();
  };

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1600&q=80"
        title="Messages"
        subtitle="Chat with your connections and collaborators"
        height={200}
      />
      <div className="page-container messages-layout">
        <div className="messages-sidebar">
          <h3>Conversations</h3>
          {conversations.map((c) => (
            <div key={c._id} className="conversation-item"
              onClick={() => openChat({ _id: c._id, name: c.user.name, profilePicture: c.user.profilePicture })}>
              <img src={c.user.profilePicture ? `${API_ROOT}${c.user.profilePicture}` : "https://via.placeholder.com/32"} alt="avatar" />
              <div>
                <strong>{c.user.name}</strong>
                <p className="muted">{c.lastMessage}</p>
              </div>
            </div>
          ))}
          <h3>Connections</h3>
          {connections.map((c) => (
            <div key={c._id} className="conversation-item" onClick={() => openChat(c)}>
              <img src={c.profilePicture ? `${API_ROOT}${c.profilePicture}` : "https://via.placeholder.com/32"} alt="avatar" />
              <div><strong>{c.name}</strong></div>
            </div>
          ))}
        </div>

        <div className="messages-chat">
          {activeUser ? (
            <>
              <h3>{activeUser.name}</h3>
              <div className="chat-messages">
                {chat.map((m) => (
                  <div key={m._id} className={`chat-bubble ${m.sender === user._id ? "sent" : "received"}`}>
                    {m.message}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={handleSend} className="chat-input">
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
                <button type="submit">Send</button>
              </form>
            </>
          ) : (
            <div className="chat-empty">
              <span>💬</span>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
