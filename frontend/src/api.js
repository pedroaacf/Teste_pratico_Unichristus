import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
let authHeader = null

export function setAuth(user, pass) {
  authHeader = 'Basic ' + btoa(`${user}:${pass}`)
}

function headers() {
  return authHeader ? { Authorization: authHeader } : {}
}

export async function fetchAgendamentos() {
  const res = await axios.get(`${baseURL}/agendamentos`, { headers: headers() })
  return res.data
}

export async function fetchAgendamento(id) {
  const res = await axios.get(`${baseURL}/agendamentos/${id}`, { headers: headers() })
  return res.data
}

export async function createAgendamento(payload) {
  const res = await axios.post(`${baseURL}/agendamentos`, payload, { headers: { ...headers(), 'Content-Type': 'application/json' } })
  return res.data
}

export async function updateAgendamento(id, payload) {
  const res = await axios.put(`${baseURL}/agendamentos/${id}`, payload, { headers: { ...headers(), 'Content-Type': 'application/json' } })
  return res.data
}

export async function deleteAgendamento(id) {
  return axios.delete(`${baseURL}/agendamentos/${id}`, { headers: headers() })
}

export async function fetchSalas() {
  const res = await axios.get(`${baseURL}/salas`, { headers: headers() })
  return res.data
}
