import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth.js";
import usersSlice from "./reducers/users.js";
import categorySlice from "./reducers/category.js";
import agencySlice from "./reducers/agency.js";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    users: usersSlice.reducer,
    category: categorySlice.reducer,
    agency: agencySlice.reducer,
  },
});

export default store;
