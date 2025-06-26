import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const data = {
  labels: ['Visitors', 'Visits', 'Documents'],
  datasets: [
    {
      label: 'Count',
      data: [12, 19, 7], // Placeholder data
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(234, 179, 8, 0.7)'
      ],
      borderRadius: 8,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
};

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Welcome, {user?.username || 'User'}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <span className="text-4xl font-bold text-blue-600">123</span>
            <span className="text-gray-500 mt-2">Visitors</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <span className="text-4xl font-bold text-green-600">45</span>
            <span className="text-gray-500 mt-2">Visits</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <span className="text-4xl font-bold text-yellow-500">7</span>
            <span className="text-gray-500 mt-2">Documents</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Overview Chart</h2>
          <div className="w-full md:w-2/3 mx-auto">
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 