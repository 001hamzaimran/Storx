// redux/reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import StoreSlice from "../slices/StoreSlice";

console.log("StoreSlice:", StoreSlice); // Should log the reducer function

const rootReducer = combineReducers({
  store: StoreSlice,
});

export { rootReducer };
