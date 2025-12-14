export const API_BASE_URL = {
  AUTH: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000',
  MUSIC: import.meta.env.VITE_MUSIC_API_URL || 'http://localhost:3001'
};

export const AUTH_API = `${API_BASE_URL.AUTH}/api/auth`;
export const MUSIC_API = `${API_BASE_URL.MUSIC}/api/music`;
