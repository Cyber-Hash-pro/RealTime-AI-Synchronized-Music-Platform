import axios from 'axios';
import {
  fetchArtistTracksStart,
  fetchArtistTracksSuccess,
  fetchArtistTracksFailure,
  createPlaylistStart,
  createPlaylistSuccess,
  createPlaylistFailure,
} from '../slices/musicslice.jsx';
import { MUSIC_API } from '../../config/api';

// Fetch artist tracks
export const fetchArtistTracks = () => async (dispatch) => {
  dispatch(fetchArtistTracksStart());
  try {
    const res = await axios.get(`${MUSIC_API}/artist-music`, {
      withCredentials: true,
    });
    dispatch(fetchArtistTracksSuccess(res.data.musics || []));
  } catch (error) {
    dispatch(
      fetchArtistTracksFailure(
        error.response?.data?.message || 'Error fetching artist music'
      )
    );

  }
};

// Fetch artist playlists
export const fetchArtistPlaylists = () => async (dispatch) => {
  dispatch(fetchArtistTracksStart()); // Reuse loading state
  try {
    const res = await axios.get(`${MUSIC_API}/artist/playlist`, { withCredentials: true });
    dispatch(fetchArtistTracksSuccess(res.data.playlists || []));
  } catch (error) {
    dispatch(fetchArtistTracksFailure(error.response?.data?.message || 'Error fetching playlists'));
  }
};

// Fetch playlist details
export const fetchPlaylistDetails = (id) => async (dispatch) => {
  dispatch(fetchArtistTracksStart()); // Reuse loading state
  try {
    const res = await axios.get(`${MUSIC_API}/artist/playlist/${id}`, { withCredentials: true });
    dispatch({ type: 'music/setPlaylistDetails', payload: res.data.playlist });
  } catch (error) {
    dispatch(fetchArtistTracksFailure(error.response?.data?.message || 'Error fetching playlist details'));
  }
};

// Create playlist with cover image
export const createPlaylist = (playlistData) => async (dispatch) => {
  dispatch(createPlaylistStart());
  try {
    const formData = new FormData();
    formData.append('title', playlistData.title);
    
    // Append each music ID to the form data
    playlistData.musics.forEach((musicId) => {
      formData.append('musics', musicId);
    });

    // Append cover image if provided
    if (playlistData.coverImage) {
      formData.append('coverImage', playlistData.coverImage);
    }

    const res = await axios.post(`${API_BASE_URL}/playlist`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch(createPlaylistSuccess(res.data.playlist));
    return { success: true, data: res.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || 'Error creating playlist';
    dispatch(createPlaylistFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};
