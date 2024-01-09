import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import greenBookAPI, { vnfixerAPI } from "@/api/greenBookAPI";
const agencySlice = createSlice({
  name: "agency",
  initialState: { status: "idle", data: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAgencies.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAgencies.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "idle";
      })
      .addCase(getAgencies.rejected, (state, action) => {
        state.status = "error";
      });
  },
});

export const getAgencies = createAsyncThunk(
  "agency/getAgencies",
  async (_, { rejectWithValue }) => {
    try {
      const res = await vnfixerAPI.getAgencies();
      if (res.status === 200) {
        return res.data.data.entries;
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

export const createagency = createAsyncThunk(
  "agency/createagency",
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

export const updateagency = createAsyncThunk(
  "agency/updateagency",
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

export const deleteagency = createAsyncThunk(
  "agency/deleteagency",
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

export default agencySlice;
