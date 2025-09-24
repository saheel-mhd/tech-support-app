// src/redux/slices/ticketSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/tickets";

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Async thunk: fetch tickets
export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { data } = await axios.get(API_URL, getConfig(auth.token));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Async thunk: create ticket
export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async ({ ticketData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.post(API_URL, ticketData, getConfig(token));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Async thunk: update ticket status
export const updateTicketStatus = createAsyncThunk(
  "tickets/updateTicketStatus",
  async ({ id, status, assignedAgent }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { data } = await axios.put(
        `${API_URL}/${id}`,
        { status, assignedAgent },
        getConfig(auth.token)
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,
  success: false, // added success flag
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    setCurrentTicket: (state, action) => {
      state.currentTicket = action.payload;
    },
    clearTickets: (state) => {
      state.tickets = [];
      state.currentTicket = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    resetSuccess: (state) => {
      state.success = false; // reset success flag
    },
  },
  extraReducers: (builder) => {
    // fetchTickets
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // createTicket
    builder
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.push(action.payload);
        state.success = true; // mark success on creation
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // updateTicketStatus
    builder
      .addCase(updateTicketStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = state.tickets.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentTicket, clearTickets, resetSuccess } = ticketSlice.actions;
export default ticketSlice.reducer;
