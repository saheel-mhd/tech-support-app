// src/pages/UserDashboard.jsx
import { useState, useEffect, useRef } from "react";
import {
  FaHeadset,
  FaHandsHelping,
  FaHistory,
  FaSignOutAlt,
  FaPlus,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NewTicket from "../components/NewTicket";
import SupportHistory from "../components/SupportHistory";
import ActiveSupport   from "../components/ActiveSupport"; // make sure you export the user version
import Users from "../components/Users";

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")
  const navigate = useNavigate();
  const [showNewTicket, setShowNewTicket] = useState(false);
  const modalRef = useRef(null);

  // Fetch tickets for the dashboard
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data);
        setLoading(false);
      } catch (err) {
        console.error("fetchData error:", err);
        setLoading(false);
      }
    };
    if (activeView === "dashboard") fetchTickets();
  }, [token, activeView]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowNewTicket(false);
      }
    };
    if (showNewTicket) {
      document.addEventListener("mousedown", handleClickOutsideModal);
    }
    return () => document.removeEventListener("mousedown", handleClickOutsideModal);
  }, [showNewTicket]);

  if (loading && activeView === "dashboard")
    return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="h-full w-64 bg-gray-900 text-white flex flex-col justify-between fixed">
        <div>
          <div className="p-6 text-2xl font-bold border-b border-gray-700">
            User Menu
          </div>
          <ul className="mt-6 space-y-4">
            <li
              className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition"
              onClick={() => setActiveView("dashboard")}
            >
              <FaHeadset /> Dashboard
            </li>
            <li
              className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition"
              onClick={() => setActiveView("active")}
            >
              <FaHandsHelping /> Active Support
            </li>
            <li
              className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition"
              onClick={() => setActiveView("history")}
            >
              <FaHistory /> Support History
            </li>
          </ul>
        </div>

        {/* Logout button */}
        <div className="mb-6 px-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-white p-4 shadow-md relative z-10">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button
            onClick={() => setShowNewTicket(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <FaPlus /> New Ticket
          </button>
        </div>

        {/* Modal for NewTicket */}
        {showNewTicket && (
          <div className="fixed inset-0 flex items-center justify-center z-20 bg-black/30">
            <div ref={modalRef} className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <NewTicket token={token} onClose={() => setShowNewTicket(false)} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {activeView === "dashboard" && (
            <p className="text-gray-600">
              Use the "New Ticket" button above to create support tickets.
            </p>
          )}
          {activeView === "users" && <Users />}
          {activeView === "active" && <ActiveSupport token={token} role={role}/>}
          {activeView === "history" && <SupportHistory token={token} />}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
