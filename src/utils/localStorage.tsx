/* eslint-disable @typescript-eslint/no-unused-vars */
export const persistLocalStorage = (accessToken: string, token: string) => {
  localStorage.setItem(accessToken, token)
}

export const clearLocalStorage = (accessToken: string) => {
  localStorage.removeItem(accessToken)
}
