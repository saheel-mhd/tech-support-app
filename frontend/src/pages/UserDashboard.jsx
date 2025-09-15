import React from "react";

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">User Dashboard</h1>
      <p className="mb-4">Here you can raise tickets, view status, and chat with support agents.</p>

      <div className="card p-4">
        <p className="text-gray-700">[TicketForm Placeholder]</p>
        <p className="text-gray-700 mt-2">[TicketList Placeholder]</p>
      </div>
    </div>
  );
};

export default UserDashboard;
