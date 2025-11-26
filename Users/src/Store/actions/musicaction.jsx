import axios from "axios";
import {   setCurrentMusic ,setAllMusic } from "../slices/musicSlice.jsx";

export const fetchMusicData = () => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:3001/api/music',{
        withCredentials: true,
      });
    //   console.log(response.data.musics)
        const musicData = response.data.musics || [];
        dispatch(setAllMusic(musicData));

    }catch (error) {
        console.error("Error fetching music data:", error);
    }
}
export const specificMusicData = (id) => async (dispatch) => {
    try{
        const response = await axios.get(`http://localhost:3001/api/music/get-details/${id}`,{
            withCredentials: true,
        });
        console.log("Specific music data response:", response.data);
        // Extract music from response.data.music
        const currentMusic = response.data.music || response.data;
        dispatch(setCurrentMusic(currentMusic));
    } catch (error) {
        console.error("Error fetching specific music data:", error);
    }
};

