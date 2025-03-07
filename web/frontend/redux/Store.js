// redux/Store.js
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers"; // Ensure this path is correct

export const store = configureStore({
  reducer: rootReducer,
});
