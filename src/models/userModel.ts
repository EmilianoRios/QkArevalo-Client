import { Roles } from '.'

export interface UserInfo {
  id: number
  name: string
  username: string
  email: string
  role: Roles
}

export interface UserAccessToken {
  accessToken: string
}

export interface UserEmptyInfo {
  id: number
  name: string
  username: string
  email: string
  role: string
}

export interface UserLogInInfo {
  username: string
  password: string
}
