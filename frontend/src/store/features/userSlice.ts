import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type UserType = {
  _id: string,
  fullname: string,
  email: string,
  rootFolder: string,
  createdAt: string,
  updatedAt: string,
}

export type UserState = {
  user: UserType | null,
}

const initialState: UserState = {
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action:PayloadAction<UserState>) => {
      state.user = action.payload.user
    },
    resetUser: (state) => {
      state.user = null
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser, resetUser } = userSlice.actions

export default userSlice.reducer