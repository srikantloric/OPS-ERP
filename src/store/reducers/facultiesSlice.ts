import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebase";

interface Faculty {
  faculty_aadhar: string;
  faculty_address: string;
  faculty_email: string;
  faculty_gender: 'male' | 'female' | 'other';
  faculty_image: string;
  faculty_image_thumb: string;
  faculty_name: string;
  faculty_pass: string; // Consider handling passwords securely
  faculty_phone: string;
  faculty_qualification: string;
  faculty_specification: string;
  id: string;
}

interface FacultyState {
  teacherArray: Faculty[];
  loading: boolean;
  error: string | null;
}

//FETCH
export const fetchTeacher = createAsyncThunk<Faculty[], void>(
  "teachers/fetchTeacher",
  async () => {
    const snap = await db.collection("FACULTIES").get();
    const teachers: Faculty[] = [];
    snap.forEach((doc) => {
      teachers.push({ ...doc.data(), id: doc.id } as Faculty);
    });
    console.log(teachers);
    sessionStorage.setItem("faculties_list", JSON.stringify(teachers));
    return teachers;
  }
);

const initialState: FacultyState = {
  teacherArray: [],
  loading: false,
  error: null,
};

const facultiesSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacher.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeacher.fulfilled, (state, action: PayloadAction<Faculty[]>) => {
        state.loading = false;
        state.teacherArray = action.payload;
      })
      .addCase(fetchTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default facultiesSlice.reducer;
