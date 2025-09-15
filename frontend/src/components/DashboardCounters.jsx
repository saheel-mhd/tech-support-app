// src/components/DashboardCounters.jsx
const DashboardCounters = ({ totalDone, totalPending, totalOngoing }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-gray-500">Supports Done</h2>
        <p className="text-3xl font-bold text-green-600">{totalDone}</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-gray-500">Pending Supports</h2>
        <p className="text-3xl font-bold text-yellow-600">{totalPending}</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-gray-500">Ongoing Supports</h2>
        <p className="text-3xl font-bold text-blue-600">{totalOngoing}</p>
      </div>
    </div>
  );
};

export default DashboardCounters;
