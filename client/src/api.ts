import axios from 'axios'

let accessToken: string | null = null
export const setAccessToken = (token: string | null) => { accessToken = token }
const configuredApiUrl = String(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '')
const apiBaseUrl = configuredApiUrl.endsWith('/api') ? configuredApiUrl : `${configuredApiUrl}/api`
export const api = axios.create({ baseURL: apiBaseUrl, withCredentials: true })
api.interceptors.request.use((config) => { if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`; return config })
export const request = async <T>(promise: Promise<{ data: { data: T } }>) => (await promise).data.data
