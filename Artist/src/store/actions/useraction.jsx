
import axios from 'axios';
import { setLoading, setUser, setError, logout as logoutAction } from '../slices/userSlice.jsx';
import { AUTH_API } from '../../config/api';

// Fetch artist profile
export const fetchArtistProfile = () => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const res = await axios.get(`${AUTH_API}/artist/me`, { withCredentials: true });
		dispatch(setUser(res.data.user));
	} catch (error) {
		dispatch(setError(error.response?.data?.message || 'Error fetching profile'));
	}
};

// Logout
export const logout = () => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		await axios.get(`${AUTH_API}/logout`, { withCredentials: true });
		dispatch(logoutAction());
		window.location.href = '/login';
	} catch (error) {
		dispatch(setError(error.response?.data?.message || 'Error logging out'));
	}
};


export const loginArtist = (credentials) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const res = await axios.post(`${AUTH_API}/login`, credentials, { withCredentials: true });
		dispatch(setUser(res.data.user));
	} catch (error) {
		dispatch(setError(error.response?.data?.message || 'Error logging in'));
	}
};		

export const signupArtist = (artistData) => async (dispatch) => {	
	dispatch(setLoading(true));
	try {
		const res = await axios.post(`${AUTH_API}/register`, artistData, { withCredentials: true });
		dispatch(setUser(res.data.user));
	} catch (error) {
		dispatch(setError(error.response?.data?.message || 'Error signing up'));
	}
}