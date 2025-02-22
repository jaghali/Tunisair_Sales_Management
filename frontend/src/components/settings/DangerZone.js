import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const DangerZone = () => {
  // Styles
  const containerStyle = {
    backgroundColor: "rgba(185, 28, 28, 0.5)", // Equivalent to bg-red-900 bg-opacity-50
    backdropFilter: "blur(8px)", // Equivalent to backdrop-blur-lg
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Equivalent to shadow-lg
    borderRadius: "0.75rem", // Equivalent to rounded-xl
    padding: "1.5rem", // Equivalent to p-6
    border: "1px solid #991B1B", // Equivalent to border-red-700
    marginBottom: "2rem", // Equivalent to mb-8
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  };

  const iconStyle = {
    color: "#F87171", // Equivalent to text-red-400
    marginRight: "0.75rem",
  };

  const titleStyle = {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#F3F4F6", // Equivalent to text-gray-100
  };

  const textStyle = {
    color: "#D1D5DB", // Equivalent to text-gray-300
    marginBottom: "1rem",
  };

  const buttonStyle = {
    backgroundColor: "#DC2626", // Equivalent to bg-red-600
    color: "white",
    fontWeight: "bold",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  };

  const buttonHoverStyle = {
    backgroundColor: "#B91C1C", // Equivalent to hover:bg-red-700
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div style={headerStyle}>
        <Trash2 style={iconStyle} size={24} />
        <h2 style={titleStyle}>Danger Zone</h2>
      </div>
      <p style={textStyle}>Permanently delete your account and all of your content.</p>
      <button
        style={buttonStyle}
        onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
        onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
      >
        Delete Account
      </button>
    </motion.div>
  );
};

export default DangerZone;
