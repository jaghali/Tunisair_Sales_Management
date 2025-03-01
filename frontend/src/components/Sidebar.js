import { BarChart2, DollarSign, Menu, Settings, TableOfContents, PackageSearch  , ChartSpline , Users, LogOut } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
    { name: "OverviewPage", icon: BarChart2, color: "#6366f1", href: "/OverviewPage" },
    { name: "Table", icon: TableOfContents , color: "#8B5CF6", href: "/admin-users" },
    { name: "Articles", icon: PackageSearch  , color: "#8B5CF6", href: "/ArticlesPage" },

    { name: "Contact", icon: Users, color: "#EC4899", href: "/admin-contact" },
    { name: "Charts", icon: ChartSpline, color: "#10B981", href: "/sales" },
    { name: "Devise", icon:  DollarSign, color: "#F59E0B", href: "/orders" },
    { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
    { name: "Logout", icon: LogOut, color: "#6EE7B7", href: "/" },
];

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const styles = {
        sidebar: {
            position: "fixed",
            top: "0",
            left: "0",
            zIndex: 9999,
            width: isSidebarOpen ? "250px" : "80px",
            height: "100vh",
            backgroundColor: "#b91c1c",
            backdropFilter: "blur(10px)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #374151",
            transition: "width 0.3s ease-in-out",
        },
        button: {
            padding: "8px",
            backgroundColor: "transparent",
            cursor: "pointer",
            transition: "background-color 0.2s",
            border: "none", // Removed border
            outline: "none", // Removed outline for focus
        },
        nav: {
            marginTop: "32px",
            flexGrow: 1,
        },
        navItem: {
            display: "flex",
            alignItems: "center",
            padding: "16px",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "8px",
            transition: "background-color 0.2s",
            marginBottom: "8px",
            textDecoration: "none",
            color: "white",
        },
        navItemActive: {
            backgroundColor: "#991b1b",
        },
    };

    return (
        <motion.div style={styles.sidebar} animate={{ width: isSidebarOpen ? "250px" : "80px" }}>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={styles.button}
            >
                <Menu size={24} color="white" />
            </motion.button>

            <nav style={styles.nav}>
                {SIDEBAR_ITEMS.map((item) => (
                    <Link key={item.href} to={item.href} style={{ textDecoration: "none" }}>
                        <motion.div
                            style={{
                                ...styles.navItem,
                                backgroundColor: "#3D3D3D",
                                ...(isSidebarOpen && item.href === window.location.pathname ? styles.navItemActive : {}),
                            }}
                        >
                            <item.icon size={20} style={{ color: "white", minWidth: "20px" }} />
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.span
                                        style={{ marginLeft: "16px", whiteSpace: "nowrap" }}
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2, delay: 0.3 }}
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </Link>
                ))}
            </nav>
        </motion.div>
    );
};

export default Sidebar;
