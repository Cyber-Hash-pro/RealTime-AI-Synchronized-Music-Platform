import axios from "axios";
import { setCurrentMusic, setAllMusic, setArtistPlaylist } from "../slices/musicSlice.jsx";

export const fetchMusicData = () => async (dispatch) => {
    try {
        console.log("fetchMusicData: Starting API call...");
        const response = await axios.get('http://localhost:3001/api/music',{
        withCredentials: true,
      });
      console.log("fetchMusicData: Response received:", response.data);
        const musicData = response.data.musics || [];
        console.log("fetchMusicData: Music data to dispatch:", musicData);
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


export const artistPlaylistFetch = () => async (dispatch) => {
    try {
       const response = await axios.get('http://localhost:3001/api/music/allPlaylist',{
        withCredentials: true,
       });
       console.log("Artist playlist response:", response.data);
       const playlistData = response.data.playlists || [];
       dispatch(setArtistPlaylist(playlistData));
    } catch (error) {
        console.error("Error setting playlist data:", error);
    }
};

export const fetchSinglePlaylist = async (id) => {
    try {
        // Fetch playlist
        const response = await axios.get(`http://localhost:3001/api/music/playlist/${id}`, {
            withCredentials: true,
        });
        console.log("Single playlist response:", response.data);
        const playlist = response.data.playlist || response.data;
        
        // If musics array contains ObjectIds, fetch each song's details
        if (playlist.musics && playlist.musics.length > 0) {
            const songPromises = playlist.musics.map(async (musicId) => {
                try {
                    const songRes = await axios.get(`http://localhost:3001/api/music/get-details/${musicId}`, {
                        withCredentials: true,
                    });
                    return songRes.data.music || songRes.data;
                } catch (err) {
                    console.error("Error fetching song:", musicId, err);
                    return null;
                }
            });
            
            const songs = await Promise.all(songPromises);
            playlist.songs = songs.filter(song => song !== null);
        }
        
        return playlist;
    } catch (error) {
        console.error("Error fetching single playlist:", error);
        throw error;
    }
};  
