// redux/slices/StoreSlice.js
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  StoreDetail: null,
  User:null,
};

const StoreSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setStoreDetail(state, action) {
      state.StoreDetail = action.payload;
    },
    setUser(state, action) {
      state.User = action.payload;
    },
  },
});

export const { setStoreDetail, setUser } = StoreSlice.actions;
export default StoreSlice.reducer; // Make sure this exports the reducer
