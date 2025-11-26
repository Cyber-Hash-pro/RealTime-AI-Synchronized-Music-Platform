import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentMusic: null,
  allMusic: []
};

const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
  
    setCurrentMusic: (state, action) => {
      state.currentMusic = action.payload;
    },
    setAllMusic: (state, action) => {
      state.allMusic = action.payload;
    }
  }
});

export const {  setCurrentMusic, setAllMusic } = musicSlice.actions;
export default musicSlice.reducer;
