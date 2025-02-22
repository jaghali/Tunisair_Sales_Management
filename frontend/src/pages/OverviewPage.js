import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import StatCard from "../components/common/StatCard"; 
import Charts from "../components/common/Charts";

const styles = {
    container: {
        padding: "5%",
        flex: 1,
        overflow: "auto",
        position: "relative",
        zIndex: 10,
    },
    main: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "24px 16px",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "32px",
    },
    chartsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "32px",
    },
};

const OverviewPage = () => {
    return (
        <div style={styles.container}>
            <main style={styles.main}>
                <motion.div
                    style={styles.statsGrid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard name="Total Revenue" icon={Zap} value="$20,000" color="#6366F1" />
                    <StatCard name="Active Users" icon={Users} value="2,500" color="#8B5CF6" />
                    <StatCard name="Total Orders" icon={ShoppingBag} value="890" color="#EC4899" />
                    <StatCard name="Bounce Rate" icon={BarChart2} value="8%" color="#10B981" />
                </motion.div>

                {/* CHARTS */}
                    <Charts />
            </main>
        </div>
    );
};

export default OverviewPage;
