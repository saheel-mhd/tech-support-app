// src/components/NewTicket.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle } from "lucide-react";
import { createTicket, resetSuccess } from "../redux/slices/ticketSlice";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ------------------- Shared Modal -------------------
const TicketModal = ({ children, title, success, error, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-black opacity-30" onClick={onClose}></div>
    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-50">
      {!success ? (
        <>
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          {children}
          {error && <p className="text-red-500 mt-2">{error}</p>}
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

// ------------------- Shared Form -------------------
const TicketForm = ({
  issue, setIssue, notes, setNotes,
  priority, setPriority, dueDate, setDueDate,
  status, setStatus, selectedUser, setSelectedUser,
  assignedAgent, setAssignedAgent, users, agents, hideUserSelect, handleSubmit, loading, hideStatusSelect,
}) => (
  <form className="space-y-4" onSubmit={handleSubmit}>
    {/* Issue */}
    <div>
      <label className="block mb-1 font-medium">Issue</label>
      <input type="text" className="w-full border rounded px-3 py-2" value={issue} onChange={(e) => setIssue(e.target.value)} required />
    </div>
    {/* Notes */}
    <div>
      <label className="block mb-1 font-medium">Notes (Optional)</label>
      <textarea className="w-full border rounded px-3 py-2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
    </div>
    {/* Priority */}
    <div>
      <label className="block mb-1 font-medium">Priority</label>
      <select className="w-full border rounded px-3 py-2" value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>
    {/* User */}
    {!hideUserSelect && (
      <div>
        <label className="block mb-1 font-medium">Select User</label>
        <select className="w-full border rounded px-3 py-2" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
          <option value="">-- Select User --</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
      </div>
    )}
    {/* Agent */}
    {agents?.length > 0 && (
      <div>
        <label className="block mb-1 font-medium">Assign Agent</label>
        <select className="w-full border rounded px-3 py-2" value={assignedAgent} onChange={(e) => setAssignedAgent(e.target.value)} required>
          <option value="">-- Select Agent --</option>
          {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
        </select>
      </div>
    )}
    {/* Due Date */}
    <div>
      <label className="block mb-1 font-medium">Due Date</label>
      <input type="date" className="w-full border rounded px-3 py-2" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
    </div>
    {/* Status */}
    {!hideStatusSelect && (
    <div>
      <label className="block mb-1 font-medium">Status</label>
      <select className="w-full border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Open</option>
        <option>In Progress</option>
        <option>Closed</option>
      </select>
    </div>
    )}
    <div className="flex mt-4">
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full px-4 py-2 rounded" disabled={loading}>
        {loading ? "Creating..." : "Create Ticket"}
      </button>
    </div>
  </form>
);

// ------------------- Admin New Ticket -------------------
const AdminNewTicket = ({ onTicketCreated, onClose }) => {
  const todayDate = new Date().toISOString().split("T")[0];
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const { loading, error, success } = useSelector(state => state.tickets);

  const [issue, setIssue] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("Low");
  const [assignedAgent, setAssignedAgent] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [dueDate, setDueDate] = useState(todayDate);
  const [status, setStatus] = useState("Open");
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchUsersAndAgents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(res.data.filter(u => u.role === "user"));
        setAgents(res.data.filter(u => u.role === "agent"));
      } catch (err) { console.error(err); }
    };
    fetchUsersAndAgents();
  }, [token]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!issue || !selectedUser || !assignedAgent) return alert("Fill required fields");
    const ticketData = { title: issue, description: notes, priority, assignedAgent, user: selectedUser, dueDate, status };
    dispatch(createTicket({ token, ticketData }));
  };

  useEffect(() => {
    if (success) {
      if (onTicketCreated) onTicketCreated();
      setTimeout(() => { dispatch(resetSuccess()); onClose(); }, 1500);
      setIssue(""); setNotes(""); setPriority("Low"); setAssignedAgent(""); setSelectedUser(""); setDueDate(todayDate); setStatus("Open");
    }
  }, [success, dispatch, onClose, onTicketCreated, todayDate]);

  return (
    <TicketModal title="Create New Ticket" loading={loading} success={success} error={error} onClose={onClose}>
      <TicketForm
        issue={issue} setIssue={setIssue}
        notes={notes} setNotes={setNotes}
        priority={priority} setPriority={setPriority}
        dueDate={dueDate} setDueDate={setDueDate}
        status={status} setStatus={setStatus}
        selectedUser={selectedUser} setSelectedUser={setSelectedUser}
        assignedAgent={assignedAgent} setAssignedAgent={setAssignedAgent}
        users={users} agents={agents}
        handleSubmit={handleSubmit}
      />
    </TicketModal>
  );
};

// ------------------- User New Ticket -------------------
const UserNewTicket = ({ onTicketCreated, onClose }) => {
  const todayDate = new Date().toISOString().split("T")[0];
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const { loading, error, success } = useSelector(state => state.tickets);

  const [issue, setIssue] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState(todayDate);
  const [status, setStatus] = useState("Open");
  const [currentUserId, setCurrentUserId] = useState("");


  useEffect (() => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(payload.userId || payload.id || payload._id);
    } catch (err) { console.error("token decode error:", err); }
  }, [token]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!issue) return alert("Enter the issue");
    const ticketData = { 
      title: issue, 
      description: notes, 
      priority, 
      user: currentUserId, 
      assignedAgent: null, 
      dueDate, 
      status };
    dispatch(createTicket({ token, ticketData }));
  };

  useEffect(() => {
    if (success) {
      if (onTicketCreated) onTicketCreated();
      setTimeout(() => { dispatch(resetSuccess()); onClose(); }, 1500);
      setIssue(""); setNotes(""); setPriority("Low"); setDueDate(todayDate); setStatus("Open");
    }
  }, [success, dispatch, onClose, onTicketCreated, todayDate]);

  return (
    <TicketModal title="Create New Ticket" loading={loading} success={success} error={error} onClose={onClose}>
      <TicketForm
        issue={issue} setIssue={setIssue}
        notes={notes} setNotes={setNotes}
        priority={priority} setPriority={setPriority}
        dueDate={dueDate} setDueDate={setDueDate}
        status={status} setStatus={setStatus} hideStatusSelect
        selectedUser={currentUserId} setSelectedUser
        users={[]} agents={[]} hideUserSelect
        handleSubmit={handleSubmit}
      />
    </TicketModal>
  );
};

// ------------------- Agent New Ticket -------------------
const AgentNewTicket = ({ onTicketCreated, onClose }) => {
  const todayDate = new Date().toISOString().split("T")[0];
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const { loading, error, success } = useSelector(state => state.tickets);

  const [issue, setIssue] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("Low");
  const [selectedUser, setSelectedUser] = useState("");
  const [dueDate, setDueDate] = useState(todayDate);
  const [status, setStatus] = useState("Open");
  const [users, setUsers] = useState([]);
  const [currentAgentId, setCurrentAgentId] = useState("");

  // Decode token to get agent ID
  useEffect(() => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentAgentId(payload.userId || payload.id || payload._id);
    } catch (err) { console.error("Token decode error:", err); }
  }, [token]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(res.data.filter(u => u.role === "user"));
      } catch (err) { console.error(err); }
    };
    fetchUsers();
  }, [token]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!issue || !selectedUser) return alert("Fill required fields");
    if (!currentAgentId) return alert("Agent not identified");
    const ticketData = { title: issue, description: notes, priority, assignedAgent: currentAgentId, user: selectedUser, dueDate, status };
    dispatch(createTicket({ token, ticketData }));
  };

  useEffect(() => {
    if (success) {
      if (onTicketCreated) onTicketCreated();
      setTimeout(() => { dispatch(resetSuccess()); onClose(); }, 1500);
      setIssue(""); setNotes(""); setPriority("Low"); setSelectedUser(""); setDueDate(todayDate); setStatus("Open");
    }
  }, [success, dispatch, onClose, onTicketCreated, todayDate]);

  return (
    <TicketModal title="Create New Ticket" loading={loading} success={success} error={error} onClose={onClose}>
      <TicketForm
        issue={issue} setIssue={setIssue}
        notes={notes} setNotes={setNotes}
        priority={priority} setPriority={setPriority}
        dueDate={dueDate} setDueDate={setDueDate}
        status={status} setStatus={setStatus}
        selectedUser={selectedUser} setSelectedUser={setSelectedUser}
        users={users} agents={[]}
        handleSubmit={handleSubmit}
      />
    </TicketModal>
  );
};

export default AdminNewTicket;
export { UserNewTicket, AgentNewTicket };
