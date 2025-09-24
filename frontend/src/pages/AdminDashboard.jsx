import { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaHeadset,
  FaUsers,
  FaHandsHelping,
  FaHistory,
  FaPlus,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Users from "../components/Users";
import ActiveSupport from "../components/ActiveSupport";
import SupportHistory from "../components/SupportHistory";
import NewTicket from "../components/NewTicket";
import DashboardCounters from "../components/DashboardCounters";
import { AdminNotifications } from "../components/Notifications";
import  AdminDashboardNotifications from "../components/Notifications"

import { logout } from "../redux/slices/authSlice";
import { fetchUsers } from "../redux/slices/userSlice";
import { fetchTickets } from "../redux/slices/ticketSlice";

const AdminDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [showNewTicket, setShowNewTicket] = useState(false);

  const sidebarRef = useRef(null);
  const modalRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  // Fetch users & tickets on mount
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchUsers());
      dispatch(fetchTickets());
    } else {
      navigate("/login");
    }
  }, [dispatch, user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutsideSidebar = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSidebar);
    return () => document.removeEventListener("mousedown", handleClickOutsideSidebar);
  }, []);

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

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 shadow-lg flex flex-col`}
      >
        <div className="p-6 text-2xl font-bold border-b border-gray-700">Admin Menu</div>

        {/* Menu items */}
        <ul className="mt-6 space-y-4 flex-1">
          <li
            className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition"
            onClick={() => {
              setActiveView("dashboard");
              setMenuOpen(false);
            }}
          >
            <FaHeadset /> Dashboard
          </li>
          <li
            className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition"
            onClick={() => {
              setActiveView("users");
              setMenuOpen(false);
            }}
          >
            <FaUsers /> Users
          </li>
          <li
            className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition"
            onClick={() => {
              setActiveView("active");
              setMenuOpen(false);
            }}
          >
            <FaHandsHelping /> Active Support
          </li>
          <li
            className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition"
            onClick={() => {
              setActiveView("history");
              setMenuOpen(false);
            }}
          >
            <FaHistory /> Support History
          </li>
          <li
            className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition"
            onClick={() => {
              setActiveView("notification");
              setMenuOpen(false);
            }}
          >
            <FaBell /> Notifications
          </li>
        </ul>

        {/* Logout button pinned to bottom */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition text-white font-medium"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-white p-4 shadow-md relative z-10">
          <button
            className="text-gray-800 text-2xl focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars />
          </button>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          {/* New Ticket Button */}
          <button
            onClick={() => setShowNewTicket(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <FaPlus /> New Ticket
          </button>
        </div>

        {/* Main views */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeView === "dashboard" && (
            <div className="flex flex-col gap-6">
              <div className="w-full">
                <DashboardCounters />
              </div>
              <div className="w-full md:w-1/2">
                <AdminDashboardNotifications />
              </div>
            </div>
          )}

          {activeView === "users" && <Users />}
          {activeView === "active" && <ActiveSupport />}
          {activeView === "history" && <SupportHistory />}
          {activeView === "notification" && <AdminNotifications />}
        </div>

        {/* New Ticket Modal */}
        {showNewTicket && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div ref={modalRef} className="p-6 rounded z-10 w-[550px]">
              <NewTicket onClose={() => setShowNewTicket(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
