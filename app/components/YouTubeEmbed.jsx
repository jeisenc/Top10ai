"use client";

import { useState } from "react";

// Shows a thumbnail first and only loads the YouTube player when tapped,
// so pages stay fast.
export default function YouTubeEmbed({ video }) {
  const [playing, setPlaying] = useState(false);
  if (!video?.videoId) return null;

  if (playing) {
    return (
      <div className="video" style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`}
          title={video.title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="video"
      onClick={() => setPlaying(true)}
      style={{ width: "100%", padding: 0, background: "none", cursor: "pointer", display: "block", position: "relative" }}
      aria-label={`Ver vídeo: ${video.title}`}
    >
      <img
        src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
        alt=""
        loading="lazy"
        style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }}
      />
      <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "16px 10px 8px", background: "linear-gradient(transparent, rgba(0,0,0,.8))", color: "#fff", fontSize: 12, textAlign: "left", display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ background: "#f00", fontWeight: 700, padding: "2px 6px", borderRadius: 3 }}>▶ Vídeo</span>
        <span>{video.title}</span>
      </span>
    </button>
  );
}
