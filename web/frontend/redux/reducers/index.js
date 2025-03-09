// redux/reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import StoreSlice from "../slices/StoreSlice";
import BackupSlice from "../slices/BackupSlice";

console.log("StoreSlice:", StoreSlice); // Should log the reducer function

const rootReducer = combineReducers({
  store: StoreSlice,
  backup: BackupSlice,
});

export { rootReducer };
