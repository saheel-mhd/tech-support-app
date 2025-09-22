import { useState, useEffect } from "react";
import axios from "axios";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";

const Users = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentRole, setCurrentRole] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Users:", data);
      setUsers(data); // ✅ store users in state
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token"); // ✅ get token from storage
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("User deleted!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };


  useEffect(() => {
    fetchUsers();

    // ✅ get current role from localStorage (or context/redux)
    const role = localStorage.getItem("role");
    setCurrentRole(role);
  }, [token]);

  // Filter users by search term
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group users by role
  const grouped = {
    user: filteredUsers.filter((u) => u.role === "user"),
    agent: filteredUsers.filter((u) => u.role === "agent"),
    admin: filteredUsers.filter((u) => u.role === "admin"),
  };

  // Render tiles
  const renderUserTile = (u) => (
    <div
      key={u._id}
      className="flex justify-between items-center bg-white rounded-lg shadow-lg px-4 py-3 mb-3 hover:shadow-xl transition"
    >
      <div>
        <p className="font-medium text-gray-800">{u.name}</p>
        <p className="text-sm text-gray-600">{u.email}</p>
      </div>
      <div className="flex space-x-2">
        {(currentRole === "admin" || currentRole === "agent") && (
          <>
            <button
              className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
              onClick={() => setEditUser(u)}
            >
              Edit
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              onClick={() => deleteUser(u._id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header with Search + Create */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold tracking-wide text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500">
          Users Management
        </h2>

        <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full md:w-64"
          />
          {(currentRole === "admin" || currentRole === "agent") && (
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow-lg transition transform hover:scale-105"
              onClick={() => setShowCreate(true)}
            >
              Create User
            </button>
          )}
        </div>
      </div>

      {/* Users by role */}
      {["user", "agent", "admin"].map((role) =>
        grouped[role].length > 0 ? (
          <div key={role} className="mb-6">
            <h3 className="text-xl font-semibold mb-3 capitalize text-gray-700">
              {role}s
            </h3>
            {grouped[role].map(renderUserTile)}
          </div>
        ) : null
      )}

      {/* CreateUser modal */}
      {showCreate && (
        <CreateUser
          token={token}
          onUserCreated={fetchUsers}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* EditUser modal */}
      {editUser && (
        <EditUser
          token={token}
          user={editUser}
          onUserUpdated={fetchUsers}
          onClose={() => setEditUser(null)}
        />
      )}
    </div>
  );
};

export default Users;
