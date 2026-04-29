import axios from 'axios'

const http = axios.create({
  timeout: 10000,
  withCredentials: true
})

function normalizeError(error, fallbackMessage = '请求失败') {
  const status = error?.response?.status
  const errcode = error?.response?.data?.errcode
  const message =
    error?.response?.data?.errmsg ||
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage

  const normalized = new Error(message)
  normalized.status = status
  normalized.errcode = errcode
  normalized.originalError = error
  return normalized
}

http.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status
    if (status === 401 && typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
    return Promise.reject(normalizeError(error))
  }
)

export function unwrapResponse(response, fallbackMessage = '请求失败') {
  const payload = response?.data
  if (payload && payload.errcode === 0) {
    return payload.data
  }

  const err = new Error(payload?.errmsg || fallbackMessage)
  err.errcode = payload?.errcode
  err.payload = payload
  throw err
}

export { normalizeError }
export default http
