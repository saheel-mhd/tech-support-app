// src/pages/AgentDashboard.jsx
import { useState, useEffect, useRef } from "react";
import {
  FaHeadset,
  FaUsers,
  FaHandsHelping,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Users from "../components/Users";
import ActiveSupport from "../components/ActiveSupport";
import SupportHistory from "../components/SupportHistory";
import NewTicket from "../components/NewTicket";

const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const sidebarRef = useRef(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  if (loading && activeView === "dashboard")
    return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="h-full w-64 bg-gray-900 text-white flex flex-col justify-between fixed"
      >
        <div>
          <div className="p-6 text-2xl font-bold border-b border-gray-700">
            Agent Menu
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
              onClick={() => setActiveView("users")}
            >
              <FaUsers /> Users
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
        <div className="flex items-center justify-between bg-white p-4 shadow-md">
          <h1 className="text-xl font-bold">
            {activeView === "dashboard"
              ? "Agent Dashboard"
              : activeView === "users"
              ? "Users"
              : activeView === "active"
              ? "Active Support"
              : activeView === "history"
              ? "Support History"
              : ""}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeView === "dashboard" && (
            <>
              {tickets.length === 0 ? (
                <p>No tickets assigned</p>
              ) : (
                <ul className="space-y-4">
                  {tickets.map((ticket) => (
                    <li
                      key={ticket.id}
                      className="bg-white p-4 rounded shadow-md flex justify-between items-center"
                    >
                      <span>{ticket.title}</span>
                      <span className="text-sm text-gray-500">
                        {ticket.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {activeView === "users" && <Users />}
          {activeView === "active" && <ActiveSupport />}
          {activeView === "history" && <SupportHistory />}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
