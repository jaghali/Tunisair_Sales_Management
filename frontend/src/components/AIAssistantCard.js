import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AIAssistantCard = () => {
  const navigate = useNavigate();

  const bubbleVariants = {
    animate: {
      scale: [1, 1.3, 1],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div style={styles.card} onClick={() => navigate(`/Gemini`)}>
      <div style={styles.betaTag}>Beta</div>

      <div style={styles.header}>
        {/* Video Animation */}
        <motion.div
          className="ai-video-container"
          style={styles.videoContainer}
        >
          <video autoPlay loop muted style={styles.video}>
            <source
              src={require("../components/Images/AiAssistant/AiassistantVideo.mp4")}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </motion.div>
      </div>

      <div style={styles.bubbleContainer}>
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="ai-bubble"
            variants={bubbleVariants}
            animate="animate"
            style={styles.bubble}
          />
        ))}
      </div>

      <p style={styles.subtext}>Listening...</p>
    </div>
  );
};

const styles = {
  card: {
     cursor:"pointer",
    backgroundColor: "#000002",
    borderRadius: "30px",
    width:"20%",
    padding: "20px",
    color: "white",
    textAlign: "center",
    boxShadow: "0px 20px 12px rgba(0, 0, 0, 0.1)",
    position: "relative", 
  },
  betaTag: {
    position: "absolute",
    top: "12px",
    right: "20px",
    backgroundColor: "#FF4C4C",
    color: "#fff",
    fontSize: "0.75rem",
    padding: "2px 8px",
    borderRadius: "12px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  videoContainer: {
    width: "200px",
    height: "300px",
    overflow: "hidden",
    borderRadius: "50%",
    display: "inline-block",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  bubbleContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "10px 0",
  },
  bubble: {
    width: "10px",
    height: "10px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    margin: "0 4px",
    display: "inline-block",
  },
  subtext: {
    fontSize: "0.875rem",
    opacity: 0.8,
  },
};

export default AIAssistantCard;
