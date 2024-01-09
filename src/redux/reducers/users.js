import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import greenBookAPI, { vnfixerAPI } from "@/api/greenBookAPI";
const usersSlice = createSlice({
  name: "users",
  initialState: { status: "idle", data: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "idle";
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = "error";
      });
  },
});

export const getUsers = createAsyncThunk("user/getUsers", async () => {
  try {
    const res = await vnfixerAPI.getUsers();
    if (res.status === 200) {
      const result = res.data.data;
      return result;
    }
  } catch (error) {
    throw error;
  }
});

export const updateUserRole = createAsyncThunk(
  "user/updateUserRole",
  async ({ id = "", listRole = "" }) => {
    try {
      const res = await greenBookAPI.updateRole(id, listRole);
      if (res.status === 200) {
        const result = res.data;
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({ id }) => {
    try {
      const res = await greenBookAPI.deleteUser(id);
      if (res.status === 200) {
        const result = res.data;
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }
);

export default usersSlice;
