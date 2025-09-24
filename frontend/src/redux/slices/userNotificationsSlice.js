// src/redux/slices/userNotificationsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { createTicket, updateTicketStatus } from "./ticketSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch notifications thunk
export const fetchUserNotifications = createAsyncThunk(
  "userNotifications/fetchUserNotifications",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("No token available");

      const res = await axios.get(`${API_BASE_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
        .map((ticket) => {
          let message = "";
          const raisedByName = ticket.raisedBy?.name || `User ID: ${ticket.raisedBy?._id || ticket.raisedBy}`;
          const userName = ticket.user?.name || `User ID: ${ticket.user?._id || ticket.user}`;
          const assignedAgentName = ticket.assignedAgent?.name || `Agent ID: ${ticket.assignedAgent?._id || ticket.assignedAgent}`;
          const statusChangedByName = ticket.statusChangedBy?.name || `User ID: ${ticket.statusChangedBy?._id || ticket.statusChangedBy}`;

          if (ticket.createdAt === ticket.updatedAt) message = `Ticket created by ${raisedByName}, for user ${userName}, status is ${ticket.status}`;
          else if (ticket.status === "Closed") message = `Completed by ${statusChangedByName}`;
          else if (ticket.statusChangedBy && ticket.status !== "Closed") message = `Status changed to ${ticket.status} by ${statusChangedByName}`;
          else if (ticket.assignedAgent) message = `Assigned agent changed to ${assignedAgentName}`;

          return {
            ...ticket,
            message,
            timeAgo: formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true }),
          };
        });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const userNotificationsSlice = createSlice({
  name: "userNotifications",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Auto-update on ticket creation
      .addCase(createTicket.fulfilled, (state, action) => {
        const t = action.payload;
        state.items = [
          {
            ...t,
            message: t.message || `Ticket created by ${t.raisedBy?.name || "User"}`,
            timeAgo: formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true }),
          },
          ...state.items,
        ].slice(0, 6);
      })
      // Auto-update on ticket status/assignment
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const t = action.payload;
        const existing = state.items.find((n) => n._id === t._id);
        if (existing) {
          existing.message = t.message || `Status updated`;
          existing.timeAgo = formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true });
        } else {
          state.items = [
            {
              ...t,
              message: t.message || `Status updated`,
              timeAgo: formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true }),
            },
            ...state.items,
          ].slice(0, 6);
        }
      });
  },
});

export default userNotificationsSlice.reducer;
