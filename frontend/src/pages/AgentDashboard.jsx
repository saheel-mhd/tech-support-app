// src/pages/AgentDashboard.jsx
import { useState, useEffect, useRef } from "react";
import {
  FaHeadset,
  FaUsers,
  FaHandsHelping,
  FaHistory,
  FaSignOutAlt,
  FaPlus,
  FaBell,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Users from "../components/Users";
import ActiveSupport from "../components/ActiveSupport";
import SupportHistory from "../components/SupportHistory";
import { AgentNewTicket } from "../components/NewTicket";
import { AgentDashboardNotifications, AgentNotifications } from "../components/Notifications";
import { setCurrentTicket, clearTickets } from "../redux/slices/ticketSlice";
import { logout } from "../redux/slices/authSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AgentDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const sidebarRef = useRef(null);
  const modalRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { token, role } = useSelector((state) => state.auth);
  const tickets = useSelector((state) => state.tickets.items);
  const loading = useSelector((state) => state.tickets.loading);

  // Fetch tickets
useEffect(() => {
  if (!token || activeView !== "dashboard") return;

  let isMounted = true;

  const fetchTickets = async () => {
    dispatch(setCurrentTicket({ loading: true, items: [] }));
    try {
      const res = await axios.get(`${API_BASE_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (isMounted) dispatch(setCurrentTicket({ items: res.data, loading: false }));
    } catch (err) {
      console.error("fetchTickets error:", err);
      if (err.response?.status === 401) {
        // Token invalid, force logout
        dispatch(logout());
        dispatch(clearTickets());
        navigate("/login", { replace: true });
      } else {
        if (isMounted) dispatch(setCurrentTicket({ items: [], loading: false }));
      }
    }
  };

  fetchTickets();

  return () => { isMounted = false };
}, [token, activeView, dispatch, navigate]);



  // Logout
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearTickets());
    navigate("/login", { replace: true });
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowNewTicket(false);
      }
    };
    if (showNewTicket) document.addEventListener("mousedown", handleClickOutsideModal);
    return () => document.removeEventListener("mousedown", handleClickOutsideModal);
  }, [showNewTicket]);

  if (loading && activeView === "dashboard")
    return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div ref={sidebarRef} className="h-full w-64 bg-gray-900 text-white flex flex-col justify-between fixed">
        <div>
          <div className="p-6 text-2xl font-bold border-b border-gray-700">Agent Menu</div>
          <ul className="mt-6 space-y-4">
            <li className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition" onClick={() => setActiveView("dashboard")}>
              <FaHeadset /> Dashboard
            </li>
            <li className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition" onClick={() => setActiveView("users")}>
              <FaUsers /> Users
            </li>
            <li className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition" onClick={() => setActiveView("active")}>
              <FaHandsHelping /> Active Support
            </li>
            <li className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition" onClick={() => setActiveView("history")}>
              <FaHistory /> Support History
            </li>
            <li className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition" onClick={() => setActiveView("notification")}>
              <FaBell /> Notifications
            </li>
          </ul>
        </div>

        {/* Logout button */}
        <div className="mb-6 px-6">
          <button onClick={handleLogout} className="flex items-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-white p-4 shadow-md relative z-10">
          <h1 className="text-xl font-bold">Agent Dashboard</h1>
          {/* New Ticket Button */}
          <button onClick={() => setShowNewTicket(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            <FaPlus /> New Ticket
          </button>
        </div>

        {/* Modal for NewTicket */}
        {showNewTicket && (
          <div className="fixed inset-0 flex items-center justify-center z-20">
            <div ref={modalRef} className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <AgentNewTicket token={token} onClose={() => setShowNewTicket(false)} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {activeView === "dashboard" && (
            <>
              <p className="text-gray-600">Use the "New Ticket" button above to create tickets.</p>
              <div className="flex flex-col gap-6 mt-4">
                <div className="w-full md:w-1/2">
                  <AgentDashboardNotifications token={token} />
                </div>
              </div>
            </>
          )}
          {activeView === "users" && <Users />}
          {activeView === "active" && <ActiveSupport token={token} role={role} />}
          {activeView === "history" && <SupportHistory token={token} />}
          {activeView === "notification" && <AgentNotifications token={token} />}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
