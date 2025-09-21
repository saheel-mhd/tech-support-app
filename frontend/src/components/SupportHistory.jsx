// src/components/SupportHistory.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const SupportHistory = ({ token }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sort by updatedAt descending (latest updated first)
        const sortedTickets = res.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setTickets(sortedTickets);
      } catch (err) {
        console.error("Error fetching support history:", err);
      }
    };
    fetchTickets();
  }, [token]);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-200 text-red-800";
      case "medium":
        return "bg-yellow-200 text-yellow-800";
      case "low":
      default:
        return "bg-green-200 text-green-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-yellow-200 text-yellow-800";
      case "in progress":
      case "inprogress":
        return "bg-blue-200 text-blue-800";
      case "closed":
      case "done":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Support History</h2>
      <div className="space-y-6">
        {tickets.length === 0 && (
          <p className="p-4 text-gray-400 italic">No tickets found.</p>
        )}

        {tickets.map((t) => (
          <div
            key={t._id}
            className="grid grid-cols-3 items-center gap-6 bg-gray-100 text-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
          >
            {/* Left section: Issue + User */}
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-lg font-semibold text-black">{t.title}</p>
              <p>
                <span className="font-semibold text-black">User:</span>{" "}
                {t.user?.name || "—"}
              </p>
              <p>
                <span className="font-semibold text-black">Raised By:</span>{" "}
                {t.raisedBy?.name || "—"}
              </p>
              <p>
                <span className="font-semibold text-black">Assigned Agent:</span>{" "}
                {t.assignedAgent?.name || "Unassigned"}
              </p>
            </div>

            {/* Center section: Priority + Status */}
            <div className="flex flex-col items-center gap-4">
              <span
                className={`px-4 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${getPriorityColor(
                  t.priority || "low"
                )}`}
              >
                Priority: {t.priority || "Low"}
              </span>

              <span
                className={`px-4 py-1 rounded-md text-xs font-semibold capitalize tracking-wide ${getStatusColor(
                  t.status
                )}`}
              >
                Status: {t.status}
              </span>
            </div>

            {/* Right section: Status Changed By + Times */}
            <div className="flex flex-col items-end gap-2 text-sm">
              <p>
                <span className="font-semibold text-black">Status Changed By:</span>{" "}
                {t.statusChangedBy?.name || "—"}
              </p>
              <p>
                <span className="font-semibold text-black">Opened:</span>{" "}
                {new Date(t.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold text-black">Closed:</span>{" "}
                {t.status?.toLowerCase() === "closed" || t.status?.toLowerCase() === "done"
                  ? new Date(t.updatedAt).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportHistory;
