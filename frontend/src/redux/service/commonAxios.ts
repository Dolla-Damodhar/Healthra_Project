import axios from 'axios'
import { getCsrfToken } from '../../utils/csrf'

const envConfig = () => ({
  healthraBaseUrl: import.meta.env.VITE_HEALTHRA_BASEURL,
})

const CSRF_METHODS = ['post', 'put', 'patch', 'delete']

// Auth is cookie-based (httpOnly access/refresh tokens set by the backend),
// so there's no token to attach here — withCredentials is what makes the
// browser send/receive those cookies at all.
const HealthraApi = axios.create({
  baseURL: envConfig().healthraBaseUrl,
  timeout: 30000,
  withCredentials: true,
})

HealthraApi.interceptors.request.use(
  (config) => {
    if (config.method && CSRF_METHODS.includes(config.method)) {
      const csrfToken = getCsrfToken()
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

let isRefreshing = false
let pendingQueue: Array<() => void> = []

HealthraApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error

    if (response?.status !== 401 || config?._retry || config?.url?.includes('auth/refresh/')) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push(() => resolve(HealthraApi(config)))
      })
    }

    config._retry = true
    isRefreshing = true

    try {
      await HealthraApi.post('auth/refresh/')
      pendingQueue.forEach((run) => run())
      pendingQueue = []
      return HealthraApi(config)
    } catch (refreshError) {
      pendingQueue = []
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export { HealthraApi, envConfig }
