import axios from "axios";
import { setCurrentMusic, setAllMusic, appendMusic, setHasMore, setArtistPlaylist, setLoading, setError } from "../slices/musicSlice.jsx";
import { MUSIC_API } from '../../config/api';

const LIMIT = 10;

export const fetchMusicData = (skip = 0, append = false) => async (dispatch) => {
    try {
        // Only show full loading for initial fetch
        if (!append) {
            dispatch(setLoading(true));
        }
        dispatch(setError(null));
        
        const response = await axios.get(`${MUSIC_API}?skip=${skip}&limit=${LIMIT}`, {
            withCredentials: true,
        });
        console.log("Music Data Response:", response.data);
        const musicData = response.data.musics || [];
        
        if (append) {
            dispatch(appendMusic(musicData));
        } else {
            dispatch(setAllMusic(musicData));
        }
        
        // If we received fewer items than limit, there's no more data
        dispatch(setHasMore(musicData.length === LIMIT));
        
        return musicData.length; // Return count for skip calculation

    } catch (error) {
        console.error("Error fetching music data:", error);
        dispatch(setError("Failed to load songs"));
        return 0;
    } finally {
        dispatch(setLoading(false));
    }
}
export const specificMusicData = (id) => async (dispatch) => {
    try{
        const response = await axios.get(`${MUSIC_API}/get-details/${id}`,{
            withCredentials: true,
        });
        const currentMusic = response.data.music || response.data;
        dispatch(setCurrentMusic(currentMusic));
    } catch (error) {
        console.error("Error fetching specific music data:", error);
    }
};


export const artistPlaylistFetch = () => async (dispatch) => {
    try {
       const response = await axios.get(`${MUSIC_API}/allPlaylist`,{
        withCredentials: true,
       });
       console.log("Playlist Data Response:", response.data);   
       const playlistData = response.data.playlists || [];
       dispatch(setArtistPlaylist(playlistData));
    } catch (error) {
        console.error("Error setting playlist data:", error);
    }
};

export const fetchSinglePlaylist = async (id) => {
    try {
        // Fetch playlist
        const response = await axios.get(`${MUSIC_API}/playlist/${id}`, {
            withCredentials: true,
        });
        const playlist = response.data.playlist || response.data;
        
        // If musics array contains ObjectIds, fetch each song's details
        if (playlist.musics && playlist.musics.length > 0) {
            const songPromises = playlist.musics.map(async (musicId) => {
                try {
                    const songRes = await axios.get(`${MUSIC_API}/get-details/${musicId}`, {
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
