import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseUrl from '../utils/url'

export const fetchQuestions = createAsyncThunk('metrics/fetchQuestions', async () => {
  const response = await fetch(`${baseUrl()}/api/metric/questions`);
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  throw new Error('Failed to fetch questions');
});

export const saveAnswers = createAsyncThunk(
  'metrics/saveAnswers',
  async ({ userId, answers }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl()}/api/metric/answers/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      if (response.ok) {
        return answers;
      }
      throw new Error('Failed to save answers');
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

const metricsSlice = createSlice({
  name: 'metrics',
  initialState: {
    questions: [],
    userAnswers: {},
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
  }
});

export default metricsSlice.reducer;
