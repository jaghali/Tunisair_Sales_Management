import { BarChart2, DollarSign, PackageSearch, ChartSpline, Plane  ,Users, LogOut, VariableIcon } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const SIDEBAR_ITEMS = [
    { name: "OverviewPage", icon: BarChart2, href: "/OverviewPage" },
    { name: "Utilisateurs", icon: Users, href: "/admin-users" },
    { name: "Articles", icon: PackageSearch, href: "/ArticlesPage" },
    { name: "Fournisseur", icon: PackageSearch, href: "/FournisseurPage" },
    { name: "Avion", icon: Plane , href: "/Avion" },
    { name: "Charts", icon: ChartSpline, href: "/sales" },
    { name: "Devise", icon: DollarSign, href: "/Devise" },
    { name: "TauxDeChange", icon:ChartSpline, href: "/Tauxdechange" },
    { name: "Logout", icon: LogOut, href: "/" },
];

const Sidebar = () => {
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
            fontSize: "1.25rem",
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

            width:"60%",
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

export default Sidebar;
