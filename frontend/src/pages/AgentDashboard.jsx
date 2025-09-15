import React from "react";

const AgentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Agent Dashboard</h1>
      <p className="mb-4">Here you can view assigned tickets, update status, and chat with users.</p>

      <div className="card p-4">
        <p className="text-gray-700">[TicketQueue Placeholder]</p>
        <p className="text-gray-700 mt-2">[TicketDetail Placeholder]</p>
      </div>
    </div>
  );
};

export default AgentDashboard;
