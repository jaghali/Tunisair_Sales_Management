import React from "react";
import { Line } from "react-chartjs-2"; // Assuming you are using chart.js

const RevenueChart = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Revenue",
        data: [5000, 7000, 6000, 8000, 9000, 12000],
        borderColor: "#10B981",
        fill: false,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md text-gray-100 mb-8">
      <h2 className="text-xl font-semibold text-blue-400">Revenue Over Time</h2>
      <Line data={data} />
    </div>
  );
};

export default RevenueChart;
