import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentMusic: null,
  allMusic: [],
  playlist:[],
  artistPlaylist:[]
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
    },
    setplaylist: (state, action) => {
      state.playlist = action.payload;
    },
    setArtistPlaylist: (state, action) => {
      state.artistPlaylist = action.payload;
    }
  }
});


export const {  setCurrentMusic, setAllMusic, setplaylist, setArtistPlaylist } = musicSlice.actions;
export default musicSlice.reducer;
