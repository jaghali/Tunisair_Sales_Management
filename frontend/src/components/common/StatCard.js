import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }) => {
  // Define the styles as JavaScript objects
  const cardStyle = {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',  // bg-gray-800 bg-opacity-50
    backdropFilter: 'blur(10px)',  // backdrop-blur-md
    borderRadius: '1rem',  // rounded-xl
    border: '1px solid rgba(107, 114, 128, 0.7)',  // border-gray-700
    overflow: 'hidden',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  };

  const contentStyle = {
    padding: '1.25rem',  // px-4 py-5 sm:p-6
  };

  const nameStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',  // text-sm
    color: 'rgba(156, 163, 175, 1)',  // text-gray-400
  };

  const iconStyle = {
    marginRight: '0.5rem',
    fontSize: '1.25rem',  // 20px for icon size
  };

  const valueStyle = {
    marginTop: '0.25rem',  // mt-1
    fontSize: '2rem',  // text-3xl
    fontWeight: '600',  // font-semibold
    color: 'rgba(248, 250, 252, 1)',  // text-gray-100
  };

  const hoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.5)',
  };

  return (
    <motion.div
      style={cardStyle}
      whileHover={{ ...hoverStyle }} // Apply hover effect
    >
      <div style={contentStyle}>
        <span style={nameStyle}>
          <Icon size={20} style={{ ...iconStyle, color }} />
          {name}
        </span>
        <p style={valueStyle}>{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
