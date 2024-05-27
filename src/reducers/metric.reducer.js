import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseUrl from "../utils/url";
import axios from "axios";

export const fetchQuestions = createAsyncThunk(
  "metrics/fetchQuestions",
  async () => {
    const response = await fetch(`${baseUrl()}/api/metric/questions`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    throw new Error("Failed to fetch questions");
  }
);

export const saveAnswers = createAsyncThunk(
  "metrics/saveAnswers",
  async ({ answers }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl()}/api/metrics/user-metrics`,
        answers
      );
      if (response.status == 200) {
        return answers;
      }
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const getUserMetrics = createAsyncThunk(
  "metrics/getMetrics",
  async () => {
    const response = await axios.get(`${baseUrl()}/api/metrics/userMetrics`);
    try {
      if (response.status === 200) {
        return response.data;
      }
      throw new Error("Failed to get metrics");
    } catch (error) {
      console.log("something went wrong");
    }
  }
);

const metricsSlice = createSlice({
  name: "metrics",
  initialState: {
    questions: [],
    userAnswers: {},
    userMetrics: "",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.loading = false;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(saveAnswers.fulfilled, (state, action) => {
        state.userAnswers = action.payload;
      });
      builder
      .addCase(getUserMetrics.fulfilled, (state, action) => {
        state.userMetrics = action.payload;
        state.loading = false;
      })
      .addCase(getUserMetrics.pending, (state, action) => {
        state.loading = true;
      });
  },
});

export default metricsSlice.reducer;
