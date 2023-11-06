import { getAccessToken } from '@/utils'
import axios from 'axios'

export const AxiosInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      config.headers['Authorization'] = `Bearer ${getAccessToken()}`
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}
