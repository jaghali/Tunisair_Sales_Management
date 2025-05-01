// StatCard.jsx
import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ name, value, icon: Icon, color }) => {
  const cardStyle = {
    position: "relative",
    width: "15%",
    padding: "2rem 2.5rem",
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: "1.5rem",
    backdropFilter: "blur(20px)",
    border: `1px solid ${color}`,
    boxShadow: `0 0 20px ${color}33, inset 0 0 10px ${color}22`,
    color: "black",
    textAlign: "center",
    overflow: "hidden",
  };

  const iconWrapper = {
    width: "72px",
    height: "72px",
    margin: "0 auto",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 0 15px ${color}55, inset 0 0 5px ${color}33`,
  };

  const titleStyle = {
    marginTop: "1.5rem",
    fontSize: "1.25rem",
    fontWeight: 600,
    letterSpacing: "0.5px",
    color:"black"
  };

  const subtitleStyle = {
    marginTop: "0.25rem",
    fontSize: "0.875rem",
    color: "black",
  };

  return (
    <motion.div
      style={cardStyle}
      whileHover={{
        transform: "translateY(-8px)",
        boxShadow: `0 0 30px ${color}77, inset 0 0 12px ${color}44`,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div style={iconWrapper}>
        <Icon size={32} color={color} />
      </div>

      <h3 style={titleStyle}>{name}</h3>
      <p style={subtitleStyle}>{value}</p>
    </motion.div>
  );
};

export default StatCard;
