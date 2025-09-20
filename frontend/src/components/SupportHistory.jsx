// src/components/SupportHistory.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const SupportHistory = ({ token }) => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);

  // Filters
  const [filterUser, setFilterUser] = useState("");
  const [filterAgent, setFilterAgent] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data);
      } catch (err) {
        console.error("Error fetching support history:", err);
      }
    };

    const fetchUsersAndAgents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
        setAgents(res.data.filter((u) => u.role === "agent"));
      } catch (err) {
        console.error("Error fetching users/agents:", err);
      }
    };

    fetchTickets();
    fetchUsersAndAgents();
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
      case "inprogress":
      case "in progress":
        return "bg-blue-200 text-blue-800";
      case "done":
      case "closed":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  // Apply filters and sort by updatedAt (latest updated first)
  const filteredTickets = tickets
    .filter((t) => {
      const matchUser = filterUser ? t.user?._id === filterUser : true;
      const matchAgent = filterAgent ? t.assignedAgent?._id === filterAgent : true;
      const matchDate = filterDate
        ? new Date(t.updatedAt).toISOString().split("T")[0] === filterDate
        : true;
      return matchUser && matchAgent && matchDate;
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Support History</h2>

      {/* Filter section */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div>
          <label className="block text-sm font-medium">Filter by User</label>
          <select
            className="border rounded px-2 py-1"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          >
            <option value="">All Users</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Filter by Agent</label>
          <select
            className="border rounded px-2 py-1"
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
          >
            <option value="">All Agents</option>
            {agents.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Filter by Date</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {/* Tickets or No tickets message */}
      <div className="space-y-6">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((t) => (
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
                  <span className="font-semibold text-black">Agent:</span>{" "}
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
                  Priority: {t.priority || "Normal"}
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
                  {t.status?.toLowerCase() === "done" ||
                  t.status?.toLowerCase() === "closed"
                    ? new Date(t.updatedAt).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-gray-500 text-lg">
            No tickets found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportHistory;
