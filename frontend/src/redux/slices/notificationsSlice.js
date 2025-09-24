import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { formatDistanceToNow, format } from "date-fns";
import axios from "axios";
import { createTicket, updateTicketStatus } from "./ticketSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch notifications thunk
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("No token available");

      const res = await axios.get(`${API_BASE_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .map((t) => ({
          _id: t._id,
          title: t.title,
          message: getAdminMessage(t),
          timeAgo: formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true }),
          updatedAt: format(new Date(t.updatedAt), "PPPp"),
          read: t.read || false,
        }));
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Mark all notifications as read thunk
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("No token available");

      await axios.patch(
        `${API_BASE_URL}/tickets/markAllRead`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return true; // just need to update state
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const getAdminMessage = (ticket) => {
  const raisedBy = ticket.raisedBy?.name || ticket.raisedBy?._id || "User";
  const statusChangedBy = ticket.statusChangedBy?.name || "N/A";
  const assignedAgent = ticket.assignedAgent?.name || "Unassigned";

  if (ticket.createdAt === ticket.updatedAt) return `Ticket created by ${raisedBy}`;
  if (ticket.status === "Closed") return `Closed by ${statusChangedBy}`;
  if (ticket.statusChangedBy) return `Status changed to ${ticket.status} by ${statusChangedBy}`;
  if (ticket.assignedAgent) return `Assigned to ${assignedAgent}`;
  return ticket.status;
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Auto-update on new ticket
      .addCase(createTicket.fulfilled, (state, action) => {
        const t = action.payload;
        state.items = [
          {
            _id: t._id,
            title: t.title,
            message: getAdminMessage(t),
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
          existing.message = getAdminMessage(t);
          existing.timeAgo = formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true });
          existing.updatedAt = format(new Date(t.updatedAt), "PPPp");
        } else {
          state.items = [
            {
              _id: t._id,
              title: t.title,
              message: getAdminMessage(t),
              timeAgo: formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true }),
              updatedAt: format(new Date(t.updatedAt), "PPPp"),
              read: false,
            },
            ...state.items,
          ].slice(0, 6);
        }
      })

      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, read: true }));
      });
  },
});

export const {} = notificationsSlice.actions;
export default notificationsSlice.reducer;
