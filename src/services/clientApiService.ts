import axios, { AxiosError } from 'axios'

const BASEURL = import.meta.env.VITE_DOMAIN + '/api/v1/clients'

export function createNewClientService(data: object) {
  return axios
    .post(`${BASEURL}/`, data)
    .then((res) => res?.data?.data)
    .catch((err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data?.error === 'P2002') {
          throw 'El cliente ingresado ya existe.'
        }
        throw 'Ha ocurrido un error al cargar el cliente.'
      }
    })
}

export function getAllClientsService(
  pagination: {
    pgsize: number
  } = { pgsize: 21 }
) {
  return axios
    .get(`${BASEURL}/?pgsize=${pagination.pgsize}`)
    .then((res) => ({
      allClients: res?.data?.data,
      totalClients: res?.data?.totalClients
    }))
    .catch(() => {
      throw 'Ha ocurrido un error'
    })
}

export function getAllClientsForEmployeeService(employeeId: string) {
  return axios
    .get(`${BASEURL}/${employeeId}`)
    .then((res) => ({
      myClients: res?.data?.data,
      totalMyClients: res?.data?.totalClients
    }))
    .catch(() => {
      throw 'Ha ocurrido un error'
    })
}

export function getOneClientService(clientId: string) {
  return axios
    .get(`${BASEURL}/${clientId}/`)
    .then((res) => res?.data?.data)
    .catch(() => {
      throw 'Ha ocurrido un error'
    })
}

export function updateOneClientService(data: object) {
  return axios
    .patch(`${BASEURL}/`, data)
    .then((res) => res?.data?.data)
    .catch(() => {
      throw 'Ha ocurrido un error'
    })
}

export function updateAllStatusClientsForEmployeeService(data: object) {
  return axios
    .patch(`${BASEURL}/status`, data)
    .then((res) => res?.data?.data)
    .catch(() => {
      throw 'Ha ocurrido un error'
    })
}

export function deleteOneClientService(clientId: string) {
  return axios
    .delete(`${BASEURL}/${clientId}`)
    .then((res) => res?.data?.data)
    .catch(() => {
      throw 'Ha ocurrido un error'
    })
}

export function deleteManyClientsService(employeeId: string) {
  return axios
    .delete(`${BASEURL}/many/${employeeId}`)
    .then((res) => res?.data?.data)
    .catch(() => {
      throw 'Ha ocurrido un error'
    })
}

export function fetchNextPageAllClients(pgnum: number) {
  return axios
    .get(`${BASEURL}/?pgnum=${pgnum}`)
    .then((res) => ({
      allClients: res?.data?.data,
      totalClients: res?.data?.totalClients
    }))
    .catch(() => {
      throw 'Ha ocurrido un error'
    })
}
