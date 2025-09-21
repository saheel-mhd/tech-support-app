import { useState, useEffect } from "react";
import axios from "axios";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";

const Users = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const deleteUser = async (id) => {
    try {
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
  }, [token]);

  // Group users by role
  const groupedUsers = users.reduce(
    (acc, user) => {
      acc[user.role] = acc[user.role] ? [...acc[user.role], user] : [user];
      return acc;
    },
    { user: [], agent: [], admin: [] }
  );

  // Filter by search
  const filterUsers = (list) =>
    list.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Users Management
        </h2>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 w-64 rounded-lg border border-gray-700 bg-gray-200 text-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg shadow-lg hover:opacity-90 transition"
            onClick={() => setShowCreate(true)}
          >
            Create User
          </button>
        </div>
      </div>

      {/* Order: Users → Agents → Admins */}
      {["user", "agent", "admin"].map((role) => {
        const group = filterUsers(groupedUsers[role]);
        return (
          <div key={role} className="mb-10">
            <h3 className="text-xl font-semibold capitalize mb-4 text-gray-300">
              {role === "user"
                ? "Users"
                : role === "agent"
                ? "Agents"
                : "Admins"}
            </h3>
            {group.length === 0 ? (
              <p className="p-4 text-black italic bg-gray-100 rounded-lg">
                No {role === "user" ? "users" : role + "s"} found.
              </p>
            ) : (
              <ul className="space-y-3">
                {group.map((u) => (
                  <li
                    key={u._id}
                    className="flex justify-between items-center px-6 py-4 bg-gray-100 border border-gray-700 rounded-xl shadow-lg hover:shadow-blue-500/20 hover:border-blue-500 transition"
                  >
                    <div>
                      <p className="font-medium text-black">{u.name}</p>
                      <p className="text-sm text-gray-700">{u.email}</p>
                      <p className="text-xs text-indigo-200 uppercase">
                        {u.role}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition"
                        onClick={() => setEditUser(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded-lg shadow hover:bg-red-700 transition"
                        onClick={() => deleteUser(u._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

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
