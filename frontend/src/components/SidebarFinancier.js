import {  Settings   ,Plane , LogOut, PlaneLanding, GiftIcon , House ,Languages } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const SIDEBAR_ITEMS = [
    { name: "Home", icon: House, color: "#6366f1", href: "/direction-financiere-dashboard" },
    { name: "Troux de Caisse", icon: Plane, color: "#6366f1", href: "/TrouxCaisse" },
    { name: "Redevance", icon: PlaneLanding, color: "#6366f1", href: "/Redevance" },
    { name: "Commission", icon:GiftIcon , color: "#8B5CF6", href: "/Commission" },
    { name: "Avance en devise", icon:GiftIcon , color: "#8B5CF6", href: "/Avances" },

    { name: "Logout", icon: LogOut, color: "#6EE7B7", href: "/" },
];

const SidebarFinancier = () => {
    const [isSidebarOpen] = useState(true);
    const location = useLocation();

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
            marginLeft:"5%",
            marginTop: "10px", 
        },
        menuItemActive: {
            color: "#fff",
            backgroundColor: "#C80505",
            transition: "color 0.3s ease-in-out, background 0.3s ease-in-out",

            width:"65%",
            marginLeft:"5%"
        },
        menuItemIcon: {
            marginRight: "16px",
            fontSize: "1.75rem",
            minWidth: "20px",
        },
        navitems: {
            marginTop:"20%",
        }
    };

    return (
        <motion.div style={styles.sidebar}>
                    <nav style={styles.navitems}>
                        {SIDEBAR_ITEMS.map((item, index) => (
                            <Link
                                key={index}
                                to={item.href}
                                style={{
                                    ...styles.menuItem,
                                    ...(location.pathname === item.href ? styles.menuItemActive : {}),
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
                        ))}
                    </nav>
                </motion.div>
    );
};

export default SidebarFinancier;
