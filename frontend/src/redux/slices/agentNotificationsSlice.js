// src/redux/slices/agentNotificationsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { formatDistanceToNow, format } from "date-fns";
import { createTicket, updateTicketStatus } from "./ticketSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper: generate message for agent
const getAgentMessage = (ticket) => {
  const raisedBy = ticket.raisedBy?.name || `User ID: ${ticket.raisedBy?._id || ticket.raisedBy}`;
  const assignedAgent = ticket.assignedAgent?.name || `Agent ID: ${ticket.assignedAgent?._id || ticket.assignedAgent}`;
  const statusChangedBy = ticket.statusChangedBy?.name || `User ID: ${ticket.statusChangedBy?._id || ticket.statusChangedBy}`;

  if (ticket.createdAt === ticket.updatedAt)
    return `Ticket created by ${raisedBy}, assigned to ${assignedAgent}`;
  if (ticket.status === "Closed") return `Completed by ${statusChangedBy}`;
  if (ticket.statusChangedBy && ticket.status !== "Closed")
    return `Status changed to ${ticket.status} by ${statusChangedBy}`;
  if (ticket.assignedAgent) return `Assigned agent changed to ${assignedAgent}`;
  return ticket.status;
};

// Fetch agent notifications
export const fetchAgentNotifications = createAsyncThunk(
  "agentNotifications/fetchAgentNotifications",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue("No token available");

      const res = await fetch(`${API_BASE_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());

      return res
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 6)
        .map((t) => ({
          _id: t._id,
          title: t.title,
          message: getAgentMessage(t),
          timeAgo: formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true }),
          updatedAt: format(new Date(t.updatedAt), "PPPp"),
          read: t.read || false,
        }));
    } catch (err) {
      return rejectWithValue(err.message || "Error fetching agent notifications");
    }
  }
);

const agentNotificationsSlice = createSlice({
  name: "agentNotifications",
  initialState: { items: [], status: "idle", error: null },
  reducers: {
    markAllAsReadLocal: (state) => {
      state.items = state.items.map((n) => ({ ...n, read: true }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgentNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAgentNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAgentNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Auto-update on ticket creation
      .addCase(createTicket.fulfilled, (state, action) => {
        const t = action.payload;
        state.items = [
          {
            _id: t._id,
            title: t.title,
            message: getAgentMessage(t),
            timeAgo: formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true }),
            updatedAt: format(new Date(t.updatedAt), "PPPp"),
            read: false,
          },
          ...state.items,
        ].slice(0, 6);
      })

      // Auto-update on ticket status/assignment change
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const t = action.payload;
        const existing = state.items.find((n) => n._id === t._id);
        if (existing) {
          existing.message = getAgentMessage(t);
          existing.timeAgo = formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true });
          existing.updatedAt = format(new Date(t.updatedAt), "PPPp");
        } else {
          state.items = [
            {
              _id: t._id,
              title: t.title,
              message: getAgentMessage(t),
              timeAgo: formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true }),
              updatedAt: format(new Date(t.updatedAt), "PPPp"),
              read: false,
            },
            ...state.items,
          ].slice(0, 6);
        }
      });
  },
});

export const { markAllAsReadLocal } = agentNotificationsSlice.actions;
export default agentNotificationsSlice.reducer;
