// src/pages/AdminDashboard.jsx
import { useState, useEffect, useRef } from "react";
import { FaBars, FaHeadset, FaUsers, FaHandsHelping, FaHistory, FaPlus, FaBell } from "react-icons/fa";
import Users from "../components/Users";
import ActiveSupport from "../components/ActiveSupport";
import SupportHistory from "../components/SupportHistory";
import NewTicket from "../components/NewTicket";
import DashboardCounters from "../components/DashboardCounters";
import AdminDashboardNotifications, { AdminNotifications } from "../components/Notifications";

const AdminDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const sidebarRef = useRef(null);
  const modalRef = useRef(null);
  const token = localStorage.getItem("token");

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
        } transition-transform duration-300 ease-in-out z-50 shadow-lg`}
      >
        <div className="p-6 text-2xl font-bold border-b border-gray-700">Admin Menu</div>
        <ul className="mt-6 space-y-4">
          <li
            className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition"
            onClick={() => { setActiveView("dashboard"); setMenuOpen(false); }}
          >
            <FaHeadset /> Dashboard
          </li>
          <li
            className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition"
            onClick={() => { setActiveView("users"); setMenuOpen(false); }}
          >
            <FaUsers /> Users
          </li>
          <li
            className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition"
            onClick={() => { setActiveView("active"); setMenuOpen(false); }}
          >
            <FaHandsHelping /> Active Support
          </li>
          <li
            className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition"
            onClick={() => { setActiveView("history"); setMenuOpen(false); }}
          >
            <FaHistory /> Support History
          </li>
          <li
            className="flex items-center gap-3 px-6 py-2 hover:bg-gray-800 rounded cursor-pointer transition"
            onClick={() => { setActiveView("notification"); setMenuOpen(false); }}
          >
            <FaBell /> Notifications
          </li>
        </ul>
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
      {/* Counters: full width */}
      <div className="w-full">
        <DashboardCounters token={token} />
      </div>

      {/* Notifications: half width below counters */}
      <div className="w-full md:w-1/2">
        <AdminDashboardNotifications token={token} />
      </div>
    </div>
  )}

  {activeView === "users" && <Users token={token} />}
  {activeView === "active" && <ActiveSupport token={token} />}
  {activeView === "history" && <SupportHistory token={token} />}
  {activeView === "notification" && <AdminNotifications token={token}/>}
</div>


        

        {/* New Ticket Modal */}
        {showNewTicket && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div ref={modalRef} className="p-6 rounded z-10 w-[550px]">
              <NewTicket token={token} onClose={() => setShowNewTicket(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
