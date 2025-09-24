import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { fetchTickets } from "../redux/slices/ticketSlice";

const DashboardCounters = ({ refreshFlag }) => {
  const dispatch = useDispatch();
  const { tickets, loading, error } = useSelector((state) => state.tickets);
  const [counts, setCounts] = useState({
    totalDone: 0,
    totalPending: 0,
    totalOngoing: 0,
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  // Fetch tickets on mount & refreshFlag
  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch, refreshFlag]);

  // Compute counts whenever tickets or selectedDate change
  useEffect(() => {
    const filteredTickets = selectedDate
      ? tickets.filter((t) => format(new Date(t.createdAt), "yyyy-MM-dd") === selectedDate)
      : tickets;

    const totalDone = filteredTickets.filter((t) => t.status === "Closed").length;
    const totalPending = filteredTickets.filter((t) => t.status === "Open").length;
    const totalOngoing = filteredTickets.filter((t) => t.status === "In Progress").length;

    setCounts({ totalDone, totalPending, totalOngoing });
  }, [tickets, selectedDate]);

  if (loading) return <p>Loading ticket counts...</p>;
  if (error) return <p className="text-red-500">Error fetching tickets: {error}</p>;

  return (
    <div className="mb-6">
      <div className="mb-4 flex justify-end items-center gap-4">
        <label className="font-medium text-gray-700">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-3 py-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-gray-500">Supports Done</h2>
          <p className="text-3xl font-bold text-green-600">{counts.totalDone}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-gray-500">Pending Supports</h2>
          <p className="text-3xl font-bold text-yellow-600">{counts.totalPending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-gray-500">Ongoing Supports</h2>
          <p className="text-3xl font-bold text-blue-600">{counts.totalOngoing}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCounters;
