import axios from 'axios'
import { configure } from 'axios-hooks'

const baseURL = '/api'

export const api = axios.create({
  baseURL,
  withCredentials: true,
})

configure({ axios: api })
