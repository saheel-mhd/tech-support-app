// src/components/ActiveSupport.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const ActiveSupport = ({ token }) => {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };

    const fetchAgents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgents(res.data.filter((u) => u.role === "agent"));
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };

    fetchTickets();
    fetchAgents();
  }, [token]);

  const updateTicket = async (id, newStatus, newAgentId) => {
    try {
      // Prepare payload
      const payload = {};
      if (newStatus) payload.status = newStatus;
      if (newAgentId !== undefined) payload.assignedAgent = newAgentId || null;

      const res = await axios.put(
        `http://localhost:5000/api/tickets/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedTicket = res.data;

      setTickets((prev) =>
        prev.map((t) => (t._id === id ? updatedTicket : t))
      );
    } catch (err) {
      console.error("Error updating ticket:", err);
      alert("Failed to update ticket. Check console for details.");
    }
  };

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

  const activeTickets = tickets.filter(
    (t) => t.status === "Open" || t.status === "In Progress"
  );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        Active Support Tickets
      </h2>

      <div className="space-y-4">
        {activeTickets.length === 0 ? (
          <p className="p-4 text-gray-400 italic">No active tickets found.</p>
        ) : (
          activeTickets.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg transition"
            >
              {/* Left section */}
              <div className="flex-1 mb-3 md:mb-0">
                <p className="text-lg font-semibold">{t.title}</p>
                <p className="text-sm text-gray-600">
                  Raised By: {t.raisedBy?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-600">
                  Raised Time: {format(new Date(t.createdAt), "dd MMM yyyy, hh:mm a")}
                </p>
                <p
                  className={`inline-block px-2 py-1 mt-1 text-sm font-medium rounded ${getPriorityColor(
                    t.priority
                  )}`}
                >
                  Priority: {t.priority || "Low"}
                </p>
                <p className="text-sm text-gray-600">
                  Status Changed By: {t.statusChangedBy?.name || "N/A"}
                </p>
              </div>

              {/* Right section */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <div className="mb-2 md:mb-0">
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    className="border rounded px-2 py-1"
                    value={t.status}
                    onChange={(e) =>
                      updateTicket(t._id, e.target.value, t.assignedAgent?._id || null)
                    }
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Assigned Agent</label>
                  <select
                    className="border rounded px-2 py-1"
                    value={t.assignedAgent?._id || ""}
                    onChange={(e) => {
                      const agentId = e.target.value === "" ? null : e.target.value;
                      updateTicket(t._id, t.status, agentId);
                    }}
                  >
                    <option value="">Unassigned</option>
                    {agents.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveSupport;
