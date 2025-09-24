// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import ticketReducer from "./slices/ticketSlice";
import userReducer from "./slices/userSlice";
import notificationsReducer from "./slices/notificationsSlice";
import userNotificationsReducer from "./slices/userNotificationsSlice";
import agentNotificationsReducer from "./slices/agentNotificationsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    users: userReducer,
    notifications: notificationsReducer,
    userNotifications: userNotificationsReducer,
    agentNotifications: agentNotificationsReducer,
  },
  devTools: true, // Enable Redux DevTools
});

export default store;
