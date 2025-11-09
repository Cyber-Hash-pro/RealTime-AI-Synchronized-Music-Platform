import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    musicdata: [],
    musicPlaylist: [],
    currenMusicid:null ,
    artistPlaylist:[],
    createPlaylist: [],
    myPlaylist:[],
}
const musicSlice = createSlice({
    name: "music",
    initialState,
    reducers: {
        setMusicData: (state, action) => {
            state.musicdata = action.payload;
        },
        setMusicPlaylist: (state, action) => {
            state.musicPlaylist = action.payload;
        },
        setCurrentMusicId: (state, action) => {
            // state.currenMusicid = action.payload;
        },
        setCreatePlaylist: (state, action) => {
            state.createPlaylist = action.payload;
        },
        setMyPlaylist: (state, action) => {
         state.myPlaylist = action.payload;
        },
        
        

    }

})
export const { setMusicData , setCreatePlaylist , setMusicPlaylist,setMyPlaylist , setCurrentMusicId } = musicSlice.actions
export default musicSlice.reducer