import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4500 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 5500 },
];

const monthlySalesData = [
  { month: "Jan", sales: 5000 },
  { month: "Feb", sales: 4000 },
  { month: "Mar", sales: 6000 },
  { month: "Apr", sales: 7000 },
  { month: "May", sales: 8000 },
  { month: "Jun", sales: 7500 },
];

const styles = {
  chartsContainer: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',  // bg-gray-800 bg-opacity-50
    backgroundOpacity: 0.5, // bg-opacity-50
    backdropFilter: "blur(10px)", // backdrop-blur-md
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // shadow-lg
    borderRadius: "16px", // rounded-xl
    padding: "24px", // p-6
    border: "1px solid #4B5563", // border-gray-700
    marginBottom: "20px",
  },
  chartsTitle: {
    fontSize: "1.25rem", // text-xl
    fontWeight: 600, // font-semibold
    color: "#F3F4F6", // text-gray-100
    marginBottom: "16px", // mb-4
  },
  chartContainer: {
    width: "100%",
    height: "300px",
  },
};

const Charts = () => {
  const chartDataArray = [salesData, monthlySalesData]; // Array of datasets for multiple charts

  return (
    <>
      {chartDataArray.map((data, index) => (
        <motion.div
          key={index} // Unique key for each chart
          style={styles.chartsContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 style={styles.chartsTitle}>Sales Trend {index + 1}</h2>
          <div style={styles.chartContainer}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default Charts;
