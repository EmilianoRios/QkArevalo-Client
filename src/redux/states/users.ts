import { UserAccessToken, UserEmptyInfo } from '@/models'
import { createSlice } from '@reduxjs/toolkit'
import { clearLocalStorage, persistLocalStorage } from '@/utils'

export const EmptyUserState: UserEmptyInfo = {
  id: 0,
  name: '',
  username: '',
  email: '',
  role: ''
}

export const UserKey = 'user'
export const AccessToken = 'accessToken'

export const userSlice = createSlice({
  name: 'user',
  initialState: EmptyUserState,
  reducers: {
    createUser: (state, action) => {
      persistLocalStorage<UserAccessToken>(AccessToken, action.payload.token)
      delete action.payload['token']
      return action.payload
    },
    updateUser: (state, action) => {
      const updatedUser = { ...state, ...action.payload }
      return updatedUser
    },
    resetUser: () => {
      clearLocalStorage(AccessToken)
      return EmptyUserState
    }
  }
})

export const { createUser, updateUser, resetUser } = userSlice.actions

export default userSlice.reducer
