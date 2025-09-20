// ./components/AdminDashboardNotifications.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow, format } from "date-fns";


const AdminDashboardNotifications = ({ token }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const latest = res.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
        .map((ticket) => {
          let message = "";

          const raisedByName = ticket.raisedBy?.name || `User ID: ${ticket.raisedBy?._id || ticket.raisedBy}`;
          const userName = ticket.user?.name || `User ID: ${ticket.user?._id || ticket.user}`;
          const assignedAgentName = ticket.assignedAgent?.name || `Agent ID: ${ticket.assignedAgent?._id || ticket.assignedAgent}`;
          const statusChangedByName = ticket.statusChangedBy?.name || `User ID: ${ticket.statusChangedBy?._id || ticket.statusChangedBy}`;

          // New ticket
          if (ticket.createdAt === ticket.updatedAt) {
            message = `Ticket created by ${raisedByName}, for user ${userName}, status is ${ticket.status}`;
          }
          // Closed ticket
          else if (ticket.status === "Closed") {
            message = `Completed by ${statusChangedByName}`;
          }
          // Status changed
          else if (ticket.statusChangedBy && ticket.status !== "Closed") {
            message = `Status changed to ${ticket.status} by ${statusChangedByName}`;
          }
          // Agent changed (if assignedAgent updated)
          else if (ticket.assignedAgent) {
            message = `Assigned agent changed to ${assignedAgentName}`;
          }

          return {
            ...ticket,
            message,
            timeAgo: formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true }),
          };
        });

      setNotifications(latest);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  return (
    <div className="bg-white shadow rounded p-4 mt-6 w-full ">
      <h2 className="font-bold mb-3">Recent Notifications</h2>
      {notifications.map((n) => (
        <div key={n._id} className="border-b py-2">
          <p className="text-sm font-semibold">{n.title}</p>
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-700">{n.message}</p>
            <span className="text-xs text-gray-400 ml-2">{n.timeAgo}</span>
          </div>
        </div>
      ))}
      {notifications.length === 0 && <p className="text-gray-500">No recent activity</p>}
    </div>
  );
};

export default AdminDashboardNotifications;




// --- Admin Notifications function ---
const AdminNotifications = ({ token }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const latest = res.data
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .map((t) => ({
          _id: t._id,
          title: t.title,
          message: getAdminMessage(t),
          timeAgo: formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true }),
          updatedAt: format(new Date(t.updatedAt), "PPPp"),
          read: t.read || false, // assuming ticket has 'read' field
        }));

      setNotifications(latest);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Call your API to mark notifications as read
      await axios.patch(
        "http://localhost:5000/api/tickets/markAllRead",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Recent Notifications</h2>
        <button
          onClick={markAllAsRead}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n._id}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-start hover:shadow-lg transition duration-300 relative"
            >
              {/* Blue dot for unread */}
              {!n.read && (
                <span className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></span>
              )}

              <div className="ml-4">
                <p className="font-semibold text-gray-800">{n.title}</p>
                <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">Updated at: {n.updatedAt}</p>
              </div>

              <span className="text-xs mt-6 text-gray-400 ml-4">{n.timeAgo}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No recent activity</p>
        )}
      </div>
    </div>
  );
};

// --- Function to generate notification message ---
const getAdminMessage = (ticket) => {
  if (ticket.assignedAgent) {
    return `Assigned agent is ${ticket.assignedAgent?.name || "Unknown"}`;
  }
  if (ticket.status === "Closed") {
    return `Completed by ${ticket.statusChangedBy?.name || "Unknown"}`;
  }
  if (ticket.createdAt === ticket.updatedAt) {
    return `Ticket is created by ${ticket.raisedBy?.name || "Unknown"} status is ${ticket.status} for user ${ticket.user?.name || "Unknown"}`;
  }
  return `Status changed to ${ticket.status} by ${ticket.statusChangedBy?.name || "Unknown"}`;
};

export {AdminNotifications};