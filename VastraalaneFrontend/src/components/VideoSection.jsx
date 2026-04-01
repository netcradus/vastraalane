import React from "react";
import "../scss/_videoSection.scss"; // styles for this section

function VideoSection() {
  return (
    <div className="video-section">
      <video className="video-content" autoPlay muted loop>
        <source
          src={require("../assets/VideoSection.mp4")} // ✅ your video file
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay">
        <h2>Discover Our Latest Collection</h2>
        <p>Experience the style and quality of Vastraaalane.</p>
        
      </div>
    </div>
  );
}

export default VideoSection;
