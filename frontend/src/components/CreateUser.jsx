import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CreateUser = ({ token, onUserCreated, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    // get current role from localStorage or context
    const storedRole = localStorage.getItem("role");
    setCurrentRole(storedRole);

    // If agent, force role to "user"
    if (storedRole === "agent") setRole("user");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const storedToken = token || localStorage.getItem("token");

      if (!storedToken) {
        alert("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      await axios.post(
        `${API_BASE_URL}/users`,
        { name, email, password, role },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      setSuccess(true);
      if (onUserCreated) onUserCreated();

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);

      setName("");
      setEmail("");
      setPassword("");
      if (currentRole === "admin") setRole("user");
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Failed to create user. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose}></div>

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-50">
        {!success ? (
          <>
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
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
                <label className="block mb-1 font-medium">Password</label>
                <input
                  type="password"
                  className="w-full border rounded px-3 py-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {currentRole === "admin" && (
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
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 animate-scaleIn">
            <CheckCircle className="text-green-500 w-16 h-16 mb-4 animate-bounce" />
            <p className="text-lg font-bold text-green-600">User Created Successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUser;
