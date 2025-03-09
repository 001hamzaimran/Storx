import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Products: null,
  Meta: null,
};

const BackupSlice = createSlice({
  name: "backup",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.Products = action.payload;
    },
    setMeta: (state, action) => {
      state.Meta = action.payload;
    },
  },
});

export const { setProducts, setMeta } = BackupSlice.actions;
export default BackupSlice.reducer;