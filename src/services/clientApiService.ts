import { getAccessToken } from '@/utils'
import axios from 'axios'

const BASEURL = import.meta.env.VITE_DOMAIN + '/api/v1/clients'

export async function createNewClientService(data: object) {
  const ACCESSTOKEN = getAccessToken()

  const res = await axios.post(`${BASEURL}/`, data, {
    headers: { Authorization: `Bearer ${ACCESSTOKEN}` }
  })
  const clientData = res?.data?.data
  return clientData
}

export async function getAllClientsService() {
  const ACCESSTOKEN = getAccessToken()

  const res = await axios.get(`${BASEURL}/`, {
    headers: { Authorization: `Bearer ${ACCESSTOKEN}` }
  })
  const clientsData = res?.data?.data
  return clientsData
}

export async function getOneClientService(clientId: string) {
  const ACCESSTOKEN = getAccessToken()

  const res = await axios.get(`${BASEURL}/${clientId}/`, {
    headers: { Authorization: `Bearer ${ACCESSTOKEN}` }
  })
  const clientData = res?.data?.data
  return clientData
}

export async function updateOneClientService(data: object) {
  const ACCESSTOKEN = getAccessToken()

  const res = await axios.patch(`${BASEURL}/`, data, {
    headers: { Authorization: `Bearer ${ACCESSTOKEN}` }
  })
  const clientData = res?.data?.data
  return clientData
}

export async function deleteOneClientService(clientId: string) {
  const ACCESSTOKEN = getAccessToken()

  const res = await axios.delete(`${BASEURL}/${clientId}`, {
    headers: { Authorization: `Bearer ${ACCESSTOKEN}` }
  })
  const clientData = res?.data?.data
  return clientData
}
