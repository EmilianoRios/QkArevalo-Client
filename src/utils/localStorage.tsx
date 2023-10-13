/* eslint-disable @typescript-eslint/no-unused-vars */
export const persistLocalStorage = <T,>(accessToken: string, token: string) => {
  localStorage.setItem(accessToken, token)
}

export const clearLocalStorage = (accessToken: string) => {
  localStorage.removeItem(accessToken)
}
