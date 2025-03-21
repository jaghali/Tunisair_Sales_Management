import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const Charts = () => {
  const data = [
    { name: "Articles", count: 150, color: "#6366F1" },
    { name: "Fournisseurs", count: 90, color: "#8B5CF6" },
    { name: "PN", count: 120, color: "#EC4899" },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" stroke="#333" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" barSize={50} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
