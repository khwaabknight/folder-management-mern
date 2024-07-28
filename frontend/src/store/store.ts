import { configureStore } from '@reduxjs/toolkit'
import userSlice from '@/store/features/userSlice'
// import tasksSlice from './features/task/tasksSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch