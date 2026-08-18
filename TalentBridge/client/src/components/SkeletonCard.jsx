import React from "react";

const SkeletonCard = () => (
  <div className="post-card skeleton-card">
    <div className="post-header">
      <div className="skel skel-avatar" />
      <div style={{ flex: 1 }}>
        <div className="skel skel-line" style={{ width: "40%" }} />
        <div className="skel skel-line" style={{ width: "60%", marginTop: 6 }} />
      </div>
    </div>
    <div className="skel skel-line" style={{ width: "100%", marginTop: 12 }} />
    <div className="skel skel-line" style={{ width: "80%", marginTop: 8 }} />
    <div className="skel skel-block" style={{ marginTop: 12 }} />
  </div>
);

export default SkeletonCard;
