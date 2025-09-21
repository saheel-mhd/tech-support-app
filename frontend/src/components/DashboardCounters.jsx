import { useState, useMemo } from "react";

const DashboardCounters = ({ tickets }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // YYYY-MM-DD

  // Filter tickets by selected date
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const updatedDate = new Date(t.updatedAt).toISOString().split("T")[0];
      return updatedDate === selectedDate;
    });
  }, [tickets, selectedDate]);

  const totalClosed = filteredTickets.filter((t) => t.status === "Closed").length;
  const totalOpen = filteredTickets.filter((t) => t.status === "Open").length;
  const totalOngoing = filteredTickets.filter((t) => t.status === "In Progress").length;

  return (
    <div>
      {/* Date selector */}
      <div className="flex justify-end mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-3 py-1"
        />
      </div>

      {/* Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-gray-500">Supports Closed</h2>
          <p className="text-3xl font-bold text-green-600">{totalClosed}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-gray-500">Open Supports</h2>
          <p className="text-3xl font-bold text-yellow-600">{totalOpen}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-gray-500">Ongoing Supports</h2>
          <p className="text-3xl font-bold text-blue-600">{totalOngoing}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCounters;
