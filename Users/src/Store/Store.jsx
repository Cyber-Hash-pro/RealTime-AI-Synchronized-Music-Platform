import { configureStore } from '@reduxjs/toolkit'
import musicReducer from './slices/musicSlice.jsx'
import userReducer from './slices/userSlice.jsx'

export const store = configureStore({
  reducer: {
    music: musicReducer,
    user: userReducer,
  },
})