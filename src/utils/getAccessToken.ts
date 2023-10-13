export function getAccessToken() {
  const ACCESSTOKEN = window.localStorage.getItem('accessToken')
  return ACCESSTOKEN
}
