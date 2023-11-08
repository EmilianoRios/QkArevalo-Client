export interface ClientModelMap {
  id: string
  name: string
  dni: string
  status: string
  employee?: { id: string; name: string }
}
