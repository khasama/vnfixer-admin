import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import greenBookAPI, { vnfixerAPI } from "@/api/greenBookAPI";
const categorySlice = createSlice({
  name: "category",
  initialState: { status: "idle", data: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "idle";
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.status = "error";
      });
  },
});

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await vnfixerAPI.getCategories();
      if (res.status === 200) {
        return res.data.data;
      } else {
        throw rejectWithValue(res.data.message);
      }
    } catch (error) {
      if (error.payload) {
        throw rejectWithValue(error.payload);
      } else {
        throw error;
      }
    }
  }
);

export const createcategory = createAsyncThunk(
  "category/createcategory",
  async ({ name = "", description = "" }) => {
    try {
      const res = await greenBookAPI.createGenre(name, description);
      console.log(res.data);
      if (res.status === 200) {
        const result = res.data;
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }
);

export const updatecategory = createAsyncThunk(
  "category/updatecategory",
  async ({ id = "", name = "", description = "" }) => {
    try {
      const res = await greenBookAPI.updateGenre(id, name, description);
      console.log(res.data);
      if (res.status === 200) {
        const result = res.data;
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }
);

export const deletecategory = createAsyncThunk(
  "category/deletecategory",
  async ({ id }) => {
    try {
      const res = await greenBookAPI.deleteGenre(id);
      if (res.status === 200) {
        const result = res.data;
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }
);

export default categorySlice;
