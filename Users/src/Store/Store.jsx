import { configureStore } from '@reduxjs/toolkit'
import musicReducer from './slices/musicSlice.jsx'

export const store = configureStore({
  reducer: {
    music: musicReducer, 
  },
})