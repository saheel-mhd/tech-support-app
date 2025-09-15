import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AgentDashboard from "./pages/AgentDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  const role = localStorage.getItem("role");

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Role-based routes */}
      <Route
        path="/user"
        element={role === "user" ? <UserDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/agent"
        element={role === "agent" ? <AgentDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin"
        element={role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
      />

      {/* Default route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
