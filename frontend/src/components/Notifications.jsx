// ./components/AdminNotifications.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow, format } from "date-fns";

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

const AdminNotifications = ({ token }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const latest = res.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((ticket) => ({
          _id: ticket._id,
          title: ticket.title,
          message: getAdminMessage(ticket),
          updatedAt: ticket.updatedAt,
          read: ticket.read || false,
        }));

      setNotifications(latest);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    // You may also send an API call to update read status in DB here
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
          className="text-blue-600 hover:underline text-sm"
        >
          Mark all as read
        </button>
      </div>
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n._id}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-start hover:shadow-lg transition duration-300"
            >
              <div className="flex gap-2 items-start">
                {!n.read && <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>}
                <div>
                  <p className="font-semibold text-gray-800">{n.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(n.updatedAt), "dd MMM yyyy, HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
