import { Settings, Plane, Home, LogOut, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useParams } from "react-router-dom";

// Gemini Icon Component
const Gemini = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none">
    <path
      d="M3 12C7.97056 12 12 7.97056 12 3C12 7.97056 16.0294 12 21 12C16.0294 12 12 16.0294 12 21C12 16.0294 7.97056 12 3 12Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const UserSidebar = () => {
  const [isSidebarOpen] = useState(true);
  const location = useLocation();
  const { matricule } = useParams();

  useEffect(() => {
    if (!matricule) {
      console.error("Matricule is not found in the URL.");
    }
  }, [matricule]);

  const SIDEBAR_ITEMS = [
    { name: "Home", icon: Home, color: "#6366f1", href: "/UserInterface" },
    { name: "Ask Gemini", icon: Gemini, color: "#6366f1", href: "/Gemini" },
    { name: "Logout", icon: LogOut, color: "#6366f1", href: "/" },
  ];


  const styles = {
    sidebar: {
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      width: isSidebarOpen ? "260px" : "80px",
      backgroundColor: "#fff",
      transition: "width 0.3s ease-in-out",
      boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      zIndex: 1000,
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      padding: "10px 30px",
      fontSize: "1.09rem",
      fontWeight: 500,
      color: "#555",
      transition: "color 0.3s ease-in-out, background 0.3s ease-in-out",
      borderRadius: "8px",
      textDecoration: "none",
      cursor: "pointer",
      marginBottom: "10px",
      marginLeft: "5%",
      marginTop: "10px",
    },
    menuItemActive: {
      color: "#fff",
      backgroundColor: "#C80505",
      width: "65%",
      marginLeft: "5%",
    },
    menuItemIcon: {
      marginRight: "16px",
      fontSize: "1.75rem",
      minWidth: "20px",
    },
    navitems: {
      marginTop: "20%",
    },
  };

  return (
    <motion.div style={styles.sidebar}>
      <nav style={styles.navitems}>
        {SIDEBAR_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.href ||
            location.pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              to={item.href}
              style={{
                ...styles.menuItem,
                ...(isActive ? styles.menuItemActive : {}),
              }}
            >
              <div style={styles.menuItemIcon}>
                <item.icon size={20} />
              </div>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default UserSidebar;
