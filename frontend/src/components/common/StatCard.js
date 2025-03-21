import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }) => {
  // Define the styles as JavaScript objects
  const cardStyle = {
    backgroundColor: '#E5E6EB', 
    backdropFilter: 'blur(10px)',  
    borderRadius: '1rem',  
    overflow: 'hidden',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  };

  const contentStyle = {
    padding: '1.25rem',  
  };

  const nameStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem', 
    color: 'black', 
  };

  const iconStyle = {
    marginRight: '0.5rem',
    fontSize: '1.25rem', 
    
  };

  const valueStyle = {
    marginTop: "30px", 
    fontSize: "2rem", 
    fontWeight: "600",
    color: "black", 
    textAlign: "center",
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
