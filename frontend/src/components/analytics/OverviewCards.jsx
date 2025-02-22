import React from "react";

const OverviewCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="p-6 bg-gray-800 rounded-lg shadow-md text-gray-100">
        <h2 className="text-xl font-semibold text-blue-400">Total Revenue</h2>
        <p className="mt-2 text-gray-300">$12,345</p>
      </div>
      <div className="p-6 bg-gray-800 rounded-lg shadow-md text-gray-100">
        <h2 className="text-xl font-semibold text-blue-400">Total Users</h2>
        <p className="mt-2 text-gray-300">5,432</p>
      </div>
      <div className="p-6 bg-gray-800 rounded-lg shadow-md text-gray-100">
        <h2 className="text-xl font-semibold text-blue-400">Orders</h2>
        <p className="mt-2 text-gray-300">1,234</p>
      </div>
    </div>
  );
};

export default OverviewCards;
