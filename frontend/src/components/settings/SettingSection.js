import { motion } from "framer-motion";

const SettingSection = ({ icon: Icon, title, children }) => {
  // Styles
  const containerStyle = {
    backgroundColor: "rgba(31, 41, 55, 0.5)", // Equivalent to bg-gray-800 with opacity
    backdropFilter: "blur(10px)", // Equivalent to backdrop-blur-lg
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Equivalent to shadow-lg
    borderRadius: "0.75rem", // Equivalent to rounded-xl
    padding: "1.5rem", // Equivalent to p-6
    border: "1px solid #374151", // Equivalent to border-gray-700
    marginBottom: "2rem", // Equivalent to mb-8
  };

  const titleStyle = {
    fontSize: "1.25rem", // Equivalent to text-xl
    fontWeight: "600", // Equivalent to font-semibold
    color: "#f3f4f6", // Equivalent to text-gray-100
  };

  const iconStyle = {
    color: "#818cf8", // Equivalent to text-indigo-400
    marginRight: "1rem", // Equivalent to mr-4
  };

  const flexStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem", // Equivalent to mb-4
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={flexStyle}>
        <Icon style={iconStyle} size={24} />
        <h2 style={titleStyle}>{title}</h2>
      </div>
      {children}
    </motion.div>
  );
};

export default SettingSection;
