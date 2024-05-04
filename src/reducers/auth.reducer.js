import { createSlice } from "@reduxjs/toolkit";

let user = JSON.parse(localStorage.getItem("user"))
  ? JSON.parse(localStorage.getItem("user"))
  : "undefined";

export const authSlice = createSlice({
  name: "user",
  initialState: {
    user: user,
    isLoading: false,
    error: false,
  },
  reducers: {
    userLoginStart: (state, action) => {
      state.isLoading = true;
    },
    userLoginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    },
    userLoginFailure: (state, action) => {
      state.isLoading = false;
      state.error = true;
    },
    userLogout: (state, action) => {
      state.user = "";
    },
  },
});

export const {
  userLoginFailure,
  userLoginStart,
  userLoginSuccess,
  userLogout,
} = authSlice.actions;
export default authSlice.reducer;
