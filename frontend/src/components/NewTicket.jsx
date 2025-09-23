// src/components/NewTicket.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const NewTicket = ({ token, onTicketCreated, onClose }) => {
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
        const resUsers = await axios.get(`${API_BASE_URL}/users`, {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issue || !selectedUser || !assignedAgent) {
      alert("Please fill in required fields (Issue, User, Agent).");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/tickets`,
        {
          title: issue,
          description: notes || "",
          priority: priority || "Low",
          assignedAgent,
          user: selectedUser,
          dueDate, // keep as string "YYYY-MM-DD"
          status: status || "Open", // must be Open | In Progress | Closed
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
      setAssignedAgent("");
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

              {/* Select User */}
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

              {/* Assign Agent */}
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

              {/* Status */}
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




//  create Ticket for User 

const UserNewTicket = ({ token, onTicketCreated, onClose, role, userId }) => {
  const todayDate = new Date().toISOString().split("T")[0];

  // Form state
  const [issue, setIssue] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("Low");
  const [assignedAgent, setAssignedAgent] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [dueDate, setDueDate] = useState(todayDate);
  const [status, setStatus] = useState("Open");

  // Data lists
  const [users, setUsers] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch users and agents
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data.filter((u) => u.role === "user"));
      } catch (err) {
        console.error("Error fetching users/agents:", err);
      }
    };
    fetchData();
  }, [token]);

  // Set defaults for agent and user roles
  useEffect(() => {
    if (role === "agent") setAssignedAgent(userId); // Agent assigns self
    if (role === "user") setStatus("Open"); // User default status
  }, [role, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!issue) {
      alert("Please enter the issue.");
      return;
    }

    if ((role === "admin" || role === "agent") && !selectedUser) {
      alert("Please select a user.");
      return;
    }

    if (role === "admin" && !assignedAgent) {
      alert("Please assign an agent.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: issue,
        description: notes || "",
        priority,
        user: role === "user" ? userId : selectedUser,
        assignedAgent:
          role === "admin" ? assignedAgent : role === "agent" ? userId : null,
        dueDate,
        status: role === "user" ? "Open" : status,
      };

      await axios.post(`${API_BASE_URL}/tickets`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      setStatus(role === "user" ? "Open" : "Open");
    } catch (err) {
      console.error("Error creating ticket:", err.response?.data || err.message);
      alert("Failed to create ticket. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Determine which fields to show
  const showSelectUser = role !== "user";

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

              {/* Select User */}
              {showSelectUser && (
                <div>
                  <label className="block mb-1 font-medium">Select User</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required={role !== "user"}
                  >
                    <option value="">-- Select User --</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
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

export  { UserNewTicket };


// new ticket for Agent
const AgentNewTicket = ({ token, onTicketCreated, onClose }) => {
  const todayDate = new Date().toISOString().split("T")[0];
  const [issue, setIssue] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("Low");
  const [selectedUser, setSelectedUser] = useState("");
  const [dueDate, setDueDate] = useState(todayDate);
  const [status, setStatus] = useState("Open"); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentAgentId, setCurrentAgentId] = useState("");

  // Helper function to decode JWT token
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Fetch users and get current agent ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const agentsList = res.data.filter((u) => u.role === "agent");
        const usersList = res.data.filter((u) => u.role === "user");
        
        setUsers(usersList);

        // Get logged-in user info from token
        const tokenData = decodeToken(token);
        
        if (tokenData) {
          // Try multiple ways to find the current agent
          let loggedInAgent = null;
          
          // Method 1: By email
          if (tokenData.email) {
            loggedInAgent = agentsList.find(agent => 
              agent.email && agent.email.toLowerCase() === tokenData.email.toLowerCase()
            );
          }
          
          // Method 2: By user ID
          if (!loggedInAgent && (tokenData.userId || tokenData.id || tokenData._id)) {
            const userId = tokenData.userId || tokenData.id || tokenData._id;
            loggedInAgent = agentsList.find(agent => agent._id === userId);
          }
          
          // Method 3: By any matching field
          if (!loggedInAgent && tokenData.sub) {
            loggedInAgent = agentsList.find(agent => agent._id === tokenData.sub);
          }
          
          if (loggedInAgent) {
            setCurrentAgentId(loggedInAgent._id);
          } else {
            console.error("FAILED: Could not find logged-in agent in agents list");
            console.error("Token contains:", Object.keys(tokenData));
            console.error("Available agents emails:", agentsList.map(a => a.email));
            console.error("Available agents IDs:", agentsList.map(a => a._id));
          }
        } else {
          console.error("Failed to decode token");
        }
      } catch (err) {
        console.error("Error fetching users/agents:", err);
      }
    };
    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issue || !selectedUser) {
      alert("Please fill in required fields (Issue, User).");
      return;
    }

    if (!currentAgentId) {
      alert("Agent not identified. Please check console for details and try refreshing the page.");
      return;
    }

    setLoading(true);
    try {
      const ticketData = {
        title: issue,
        description: notes || "",
        priority,
        assignedAgent: currentAgentId,
        user: selectedUser,
        dueDate,
        status,
      };

      await axios.post(
        `${API_BASE_URL}/tickets`,
        ticketData,
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

              {/* Select User */}
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
                    <option key={user._id} value={user._id}>{user.name}</option>
                  ))}
                </select>
              </div>

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

              {/* Status */}
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

export { AgentNewTicket };