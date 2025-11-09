
import {musicapi} from '../../api/axios.jsx'
import {setCreatePlaylist,setCurrentMusicId,setMusicData,setMusicPlaylist,setMyPlaylist} from '../slices/musicSlice.jsx'


export const fetchMusicData = () => async (dispatch) => {
    try{
    const response = await musicapi.get('/music'); // remain is pagenation baki hae edar 
    dispatch(setMusicData(response.data.musics));
    console.log("Fetched Music Data:", response.data.musics);}
    catch(error){
        console.log('Someting error in fetchmusicdata',error)
    }
}

export const fetchMusicPlaylist = () => async (dispatch) => {
    try{
        // this only for user that fetch all playlist from artist 
    const response = await musicapi.get('/music/allPlaylist'); 
    console.log("Playlist Response:", response);
    dispatch(setMusicPlaylist(response.data.playlists));
    console.log("Fetched Music Playlist:", response.data.playlists);}
    catch(error){
        console.log('Someting error in fetchmusicdata',error)
    }
} 
export const createMyPlaylist = (playlistData) => async (dispatch) => {
    try{
    const response = await musicapi.post('/music/createUserPlaylist',playlistData); 
    console.log("Create Playlist Response:", response);
   return dispatch(setMyPlaylist(response.data.playlist));
}
    catch(error){
        console.log('Someting error in createMyPlaylist',error)
    }   
};  

export const fetchMyPlaylists = () => async (dispatch) => {
    try{
        // this only for user that fetch all playlist from artist 
    const response = await musicapi.get('/music/userPlaylists'); 
    console.log("User Playlists Response:", response.data.playlists);
  return   dispatch(setMyPlaylist(response.data.playlists));
    // console.log("Fetched User Playlists:", response.data.playlists);
}
    catch(error){
        console.log('Someting error in fetchMyPlaylists',error)
    }
}   