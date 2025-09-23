// src/components/ActiveSupport.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ActiveSupport = ({ token, role }) => {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);


  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter & sort here
        const filtered = res.data
          .filter((t) => t.status === "Open" || t.status === "In Progress")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setTickets(filtered);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };

    const fetchAgents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users`, {
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

  const updateTicket = async (id, newStatus, newAgent) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/tickets/${id}`,
        { 
          status: newStatus, 
          assignedAgent: newAgent || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTickets((prev) =>
        prev
          .map((t) => (t._id === id ? res.data : t))
          .filter((t) => t.status === "Open" || t.status === "In Progress")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (err) {
      console.error("Error updating ticket:", err.response?.data || err);
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Active Support Tickets</h2>
      <div className="space-y-4">
        {tickets.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
            No active tickets found.
          </div>
        )}
        {tickets.map((t) => (
          <div
            key={t._id}
            className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center justify-between"
          >
            {/* Left section: Issue & Details */}
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

            {/* Right section: Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              {/* Status Dropdown */}
              <div className="mb-2 md:mb-0">
                <label className="block text-sm font-medium">Status</label>
                <select
                  className="border rounded px-2 py-1"
                  value={t.status}
                  onChange={(e) => updateTicket(t._id, e.target.value, t.assignedAgent)}
                >
                  <option value="Open">Open</option>
                  {role !== "user" && <option value="In Progress">In Progress</option>}
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Assigned Agent */}
              <div>
                <label className="block text-sm font-medium">Assigned Agent</label>
                {role === "user" ? (
                  <p className="text-gray-700">{t.assignedAgent?.name || "Unassigned"}</p>
                ) : (
                  <select
                    className="border rounded px-2 py-1"
                    value={t.assignedAgent?._id || ""}
                    onChange={(e) => updateTicket(t._id, t.status, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {agents.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveSupport;