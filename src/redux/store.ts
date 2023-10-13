import { UserEmptyInfo } from '@/models'
import { configureStore } from '@reduxjs/toolkit'
import userSliceReducer from './states/users'

export interface AppStore {
  user: UserEmptyInfo
}

export default configureStore<AppStore>({
  reducer: {
    user: userSliceReducer
  }
})
