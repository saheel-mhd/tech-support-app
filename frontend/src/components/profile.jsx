// src/components/Profile.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle } from "lucide-react";
import { updateUser } from "../redux/slices/userSlice";
import { logout } from "../redux/slices/authSlice";

const Profile = ({ userId }) => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  const authUser = useSelector((state) => state.auth.user);

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load profile from Redux or fallback to authUser
  useEffect(() => {
    const user = users.find((u) => u._id === userId) || authUser;
    if (user) {
      setProfile(user);
      setName(user.name);
      setEmail(user.email);
    }
  }, [users, userId, authUser]);

  // Password match validation
  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
        alert("Passwords do not match!");
        return;
    }

    setUpdating(true);
    try {
        const updatedData = { name, email };
        if (password) updatedData.password = password;

        // Use userId if provided, otherwise fallback to authUser._id
        const dispatchId = userId || authUser._id;

        const result = await dispatch(updateUser({ id: dispatchId, userData: updatedData })).unwrap();

        // Update local profile state immediately
        setProfile(result);
        setName(result.name);
        setEmail(result.email);

        setSuccess(true);
        setTimeout(() => setSuccess(false), 1500);

        // Force logout if password was changed
        if (password) {
        alert("Password changed! Please log in again.");
        dispatch(logout());
        }
    } catch (err) {
        console.error("Error updating profile:", err);
        alert("Failed to update profile. Check console for details.");
    } finally {
        setUpdating(false);
        setPassword("");
        setConfirmPassword("");
    }
  };


  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      {!success ? (
        <>
          <h2 className="text-2xl font-bold mb-4">My Profile</h2>
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
              <label className="block mb-1 font-medium">New Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                className={`w-full border rounded px-3 py-2 ${!passwordsMatch ? "border-red-500" : ""}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {!passwordsMatch && <p className="text-red-500 text-sm mt-1">Passwords do not match</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 animate-scaleIn">
          <CheckCircle className="text-green-500 w-16 h-16 mb-4 animate-bounce" />
          <p className="text-lg font-bold text-green-600">Profile Updated Successfully!</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
