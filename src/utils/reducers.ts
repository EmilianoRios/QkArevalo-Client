import { ClientModelMap } from '@/models'

export const reducerClients = (state: any, action: any) => {
  switch (action.type) {
    case 'FETCH_SUCCESS': {
      return action.payload
    }
    case 'ADD_CLIENT': {
      return [action.payload, ...state]
    }
    case 'UPDATE_CLIENT': {
      const updatedClients = action.payload

      const updatedClientsMap = new Map(
        updatedClients.map((client: ClientModelMap) => [client.id, client])
      )

      const updatedState = state.map((client: ClientModelMap) => {
        const updatedClient = updatedClientsMap.get(client.id)
        return updatedClient ? { ...client, ...updatedClient } : client
      })

      return updatedState
    }
    case 'DELETE_CLIENT': {
      const newList = state.filter(
        (client: ClientModelMap) => client.id !== action.payload
      )
      return newList
    }
    case 'ADD_PAGE': {
      return state.concat(action.payload)
    }
    default: {
      return state
    }
  }
}
