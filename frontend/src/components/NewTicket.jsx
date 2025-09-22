// src/components/NewTicket.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";

const NewTicket = ({ token, onTicketCreated, onClose, role, userId }) => {
  const todayDate = new Date().toISOString().split("T")[0];
  const [issue, setIssue] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("Low");
  const [assignedAgent, setAssignedAgent] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [dueDate, setDueDate] = useState(todayDate);
  const [status, setStatus] = useState("Open");
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(resUsers.data.filter((u) => u.role === "user"));
        setAgents(resUsers.data.filter((u) => u.role === "agent"));
      } catch (err) {
        console.error("Error fetching users/agents:", err);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (role === "user") {
      setStatus("Open"); // force "Open" for normal users
    }
    if (role === "agent") {
      setAssignedAgent(userId); // auto-assign logged-in agent
    }
  }, [role, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issue) {
      alert("Please enter the issue.");
      return;
    }
    if (role === "admin" && (!selectedUser || !assignedAgent)) {
      alert("Please select a user and assign an agent.");
      return;
    }
    if (role === "agent" && !selectedUser) {
      alert("Please select a user.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/tickets",
        {
          title: issue,
          description: notes || "",
          priority: priority || "Low",
          assignedAgent: role === "admin" ? assignedAgent : role === "agent" ? userId : null,
          user: role === "user" ? userId : selectedUser,
          dueDate,
          status: role === "user" ? "Open" : status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      if (onTicketCreated) onTicketCreated();

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);

      // Reset form
      setIssue("");
      setNotes("");
      setPriority("Low");
      setAssignedAgent(role === "agent" ? userId : "");
      setSelectedUser("");
      setDueDate(todayDate);
      setStatus("Open");
    } catch (err) {
      console.error("Error creating ticket:", err.response?.data || err.message);
      alert("Failed to create ticket. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose}></div>

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-50">
        {!success ? (
          <>
            <h2 className="text-xl font-bold mb-4">Create New Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Issue */}
              <div>
                <label className="block mb-1 font-medium">Issue</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block mb-1 font-medium">Notes (Optional)</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block mb-1 font-medium">Priority</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              {/* Select User (admin & agent only) */}
              {role !== "user" && (
                <div>
                  <label className="block mb-1 font-medium">Select User</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required
                  >
                    <option value="">-- Select User --</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Assign Agent (admin only) */}
              {role === "admin" && (
                <div>
                  <label className="block mb-1 font-medium">Assign Agent</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={assignedAgent}
                    onChange={(e) => setAssignedAgent(e.target.value)}
                    required
                  >
                    <option value="">-- Select Agent --</option>
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Due Date */}
              <div>
                <label className="block mb-1 font-medium">Due Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              {/* Status (admin only) */}
              {role === "admin" && (
                <div>
                  <label className="block mb-1 font-medium">Status</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Closed</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Ticket"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 animate-scaleIn">
            <CheckCircle className="text-green-500 w-16 h-16 mb-4 animate-bounce" />
            <p className="text-lg font-bold text-green-600">Ticket Raised Successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewTicket;
