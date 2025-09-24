// ./components/Notifications.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../redux/slices/notificationsSlice";
import { fetchAgentNotifications, markAllAsReadLocal } from "../redux/slices/agentNotificationsSlice";
import { fetchUserNotifications } from "../redux/slices/userNotificationsSlice";



const AdminDashboardNotifications = () => {
  const dispatch = useDispatch();
  const { items: notifications, status, error } = useSelector(
    (state) => state.notifications
  );
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) dispatch(fetchNotifications());
  }, [dispatch, token]);

  return (
    <div className="bg-white shadow rounded p-4 mt-6 w-full ">
      <h2 className="font-bold mb-3">Recent Notifications</h2>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p className="text-red-500">{error}</p>}
      {notifications.map((n) => (
        <div key={n._id} className="border-b py-2">
          <p className="text-sm font-semibold">{n.title}</p>
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-700">{n.message}</p>
            <span className="text-xs text-gray-400 ml-2">{n.timeAgo}</span>
          </div>
        </div>
      ))}
      {notifications.length === 0 && status !== "loading" && (
        <p className="text-gray-500">No recent activity</p>
      )}
    </div>
  );
};

export default AdminDashboardNotifications;




const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// --- Admin Notifications function ---
const AdminNotifications = () => {
  const dispatch = useDispatch();
  const { items: notifications, status, error } = useSelector((state) => state.notifications);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) dispatch(fetchNotifications());
  }, [dispatch, token]);

  const markAllAsRead = () => {
    dispatch(markAllAsReadLocal());
    // optionally call API to persist read status
  };

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
        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p className="text-red-500">{error}</p>}

        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n._id}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-start hover:shadow-lg transition duration-300 relative"
            >
              {!n.read && <span className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></span>}

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

export { AdminNotifications };


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

export {getAdminMessage};



// ------ user notification ------
const UserDashboardNotifications = () => {
  const dispatch = useDispatch();
  const { items: notifications, status, error } = useSelector(
    (state) => state.userNotifications
  );

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) dispatch(fetchUserNotifications());
  }, [dispatch, token]);

  return (
    <div className="bg-white shadow rounded p-4 mt-6 w-full ">
      <h2 className="font-bold mb-3">Recent Notifications</h2>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p className="text-red-500">{error}</p>}
      {notifications.map((n) => (
        <div key={n._id} className="border-b py-2">
          <p className="text-sm font-semibold">{n.title}</p>
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-700">{n.message}</p>
            <span className="text-xs text-gray-400 ml-2">{n.timeAgo}</span>
          </div>
        </div>
      ))}
      {notifications.length === 0 && status !== "loading" && (
        <p className="text-gray-500">No recent activity</p>
      )}
    </div>
  );
};

export { UserDashboardNotifications };









// --- User Notifications function ---
const UserNotifications = () => {
  const dispatch = useDispatch();
  const { items: notifications, status, error } = useSelector(
    (state) => state.userNotifications
  );

  useEffect(() => {
    dispatch(fetchUserNotifications());
  }, [dispatch]);

  const markAllAsRead = () => {
    dispatch(markAllAsReadLocal());
    // optionally call backend API here if needed
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Notifications</h2>
        <button
          onClick={markAllAsRead}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Mark all as read
        </button>
      </div>

      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n._id}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-start hover:shadow-lg transition duration-300 relative"
            >
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
const getUserMessage = (ticket) => {
  if (ticket.status === "Closed") {
    return `Your ticket was closed by ${ticket.statusChangedBy?.name || "Unknown"}`;
  }
  if (ticket.createdAt === ticket.updatedAt) {
    return `You created ticket "${ticket.title}" with status ${ticket.status}`;
  }
  if (ticket.assignedAgent) {
    return `Ticket assigned to ${ticket.assignedAgent?.name || "Unknown"}`;
  }
  return `Ticket status changed to ${ticket.status}`;
};
export  { UserNotifications };


// --- agent Notifications function ---
const AgentNotifications = () => {
  const dispatch = useDispatch();
  const { items: notifications, status, error } = useSelector(
    (state) => state.agentNotifications
  );

  useEffect(() => {
    dispatch(fetchAgentNotifications());
  }, [dispatch]);

  const markAllAsRead = () => {
    dispatch(markAllAsReadLocal());
    // optionally call backend API if needed
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Notifications</h2>
        <button
          onClick={markAllAsRead}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Mark all as read
        </button>
      </div>

      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n._id}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-start hover:shadow-lg transition duration-300 relative"
            >
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

const getAgentMessage = (ticket) => {
  if (ticket.status === "Closed") {
    return `Your ticket was closed by ${ticket.statusChangedBy?.name || "Unknown"}`;
  }
  if (ticket.createdAt === ticket.updatedAt) {
    return `You created ticket "${ticket.title}" with status ${ticket.status}`;
  }
  if (ticket.assignedAgent) {
    return `Ticket assigned to ${ticket.assignedAgent?.name || "Unknown"}`;
  }
  return `Ticket status changed to ${ticket.status}`;
};

export  { AgentNotifications };





// -- user Dashboard Notification ---
const AgentDashboardNotifications = () => {
  const dispatch = useDispatch();
  const { items: notifications, status, error } = useSelector(
    (state) => state.agentNotifications
  );

  useEffect(() => {
    dispatch(fetchAgentNotifications());
  }, [dispatch]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsReadLocal());
  };

  return (
    <div className="bg-white shadow rounded p-4 mt-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">Recent Notifications</h2>
        <button
          onClick={handleMarkAllAsRead}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Mark all as read
        </button>
      </div>

      {status === "loading" && <p>Loading notifications...</p>}
      {status === "failed" && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n._id} className="border-b py-2 flex justify-between">
              <div>
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-sm text-gray-700">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">Updated at: {n.updatedAt}</p>
              </div>
              <span className="text-xs text-gray-400 ml-2">{n.timeAgo}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export { AgentDashboardNotifications };