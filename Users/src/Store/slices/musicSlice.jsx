import { createSlice } from "@reduxjs/toolkit";
import { userPlaylists } from "../../data/dummyData";

const initialState = {
  currentMusic: null,
  allMusic: [],
  playlist:[],
  artistPlaylist:[],
  hasMore: true,
  loading: false,
  error: null,
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
    appendMusic: (state, action) => {
      state.allMusic = [...state.allMusic, ...action.payload];
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setplaylist: (state, action) => {
      state.playlist = action.payload;
    },
    setArtistPlaylist: (state, action) => {
      state.artistPlaylist = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

  }
});


export const {  setCurrentMusic, setAllMusic, appendMusic, setHasMore, setplaylist, setArtistPlaylist, setUserPlaylists, setLoading, setError } = musicSlice.actions;
export default musicSlice.reducer;
