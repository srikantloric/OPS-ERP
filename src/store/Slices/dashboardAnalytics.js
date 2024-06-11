import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchTotalStudents = createAsyncThunk(
  "analytics/fetchTotalStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://us-central1-orient-public-school.cloudfunctions.net/countDocuments?collectionName=STUDENTS`
      );
      const { count } = await response.json();
      return count;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const apiSlice = createSlice({
  name: "studentCount",
  initialState: {
    count: 0,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalStudents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTotalStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.count = action.payload;
      })
      .addCase(fetchTotalStudents.rejected, (state, action) => {
        state.status = "failed";
        console.log(action.payload);
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default apiSlice.reducer;
