import { UserLogInInfo } from '@/models'
import { getAccessToken } from '@/utils'
import axios from 'axios'

const BASEURL = import.meta.env.VITE_DOMAIN + '/api/v1/users'

export async function logInUserService(data: UserLogInInfo) {
  const res = await axios.post(`${BASEURL}/login`, data)
  const userData = res?.data?.data
  return userData
}

export async function authenticateUserService() {
  const ACCESSTOKEN = getAccessToken()

  if (!ACCESSTOKEN) return

  const res = await axios.get(`${BASEURL}/auth/authenticate`, {
    headers: { Authorization: `Bearer ${ACCESSTOKEN}` }
  })
  const userData = res?.data?.data
  return userData
}

export async function registerNewUserService(data: object) {
  const res = await axios.post(`${BASEURL}/`, data)
  const userData = res?.data?.data
  return userData
}
