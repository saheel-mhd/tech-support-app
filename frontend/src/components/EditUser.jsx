import { useState } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const EditUser = ({ token, user, onUserUpdated, onClose }) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [role, setRole] = useState(user.role || "user");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.put(
        `${API_BASE_URL}/users/${user._id}`,
        { name, email, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      setTimeout(() => {
        onUserUpdated(); // refresh list
        onClose(); // close modal
      }, 1500);
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black opacity-30"
        onClick={onClose}
      ></div>

      {/* Popup box */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-50">
        {!success ? (
          <>
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            {error && <p className="text-red-600 mb-2">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Role</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 animate-scaleIn">
            <CheckCircle className="text-green-500 w-16 h-16 mb-4 animate-bounce" />
            <p className="text-lg font-bold text-green-600">
              User Updated Successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUser;
