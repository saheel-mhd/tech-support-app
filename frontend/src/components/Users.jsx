import { useState, useEffect } from "react";
import axios from "axios";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser"; // import

const Users = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null); // user to edit

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => setShowCreate(true)}
        >
          Create User
        </button>
      </div>

      {/* Users list */}
      <div className="bg-gray-50 rounded-lg shadow overflow-hidden">
        {users.length === 0 ? (
          <p className="p-4 text-gray-500">No users found.</p>
        ) : (
          <ul>
            {users.map((u) => (
              <li
                key={u._id}
                className="flex justify-between items-center px-4 py-3 border-b hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{u.name}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  <p className="text-sm text-gray-500 capitalize">{u.role}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                    onClick={() => setEditUser(u)} // open EditUser modal
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
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
